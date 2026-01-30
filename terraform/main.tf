terraform {
  required_version = ">= 1.0"
  required_providers {
    aws    = { source = "hashicorp/aws", version = "~> 5.0" }
    random = { source = "hashicorp/random", version = "~> 3.6" }
    null   = { source = "hashicorp/null", version = "~> 3.2" }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "rfsbase"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

data "aws_vpc" "default" { default = true }
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}
data "aws_caller_identity" "current" {}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# IAM
resource "aws_iam_role" "ec2" {
  name = "rfsbase-${var.environment}-ec2"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_instance_profile" "ec2" {
  name = "rfsbase-${var.environment}-ec2"
  role = aws_iam_role.ec2.name
}

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "cloudwatch" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

# Bedrock - for Claude Code (cross-region inference profiles)
resource "aws_iam_role_policy" "bedrock" {
  name = "bedrock-claude-code"
  role = aws_iam_role.ec2.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "BedrockInvoke"
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream",
          "bedrock:ListInferenceProfiles"
        ]
        Resource = [
          "arn:aws:bedrock:*:*:inference-profile/*",
          "arn:aws:bedrock:*:*:application-inference-profile/*",
          "arn:aws:bedrock:*::foundation-model/*"
        ]
      },
      {
        Sid      = "BedrockList"
        Effect   = "Allow"
        Action   = ["bedrock:ListFoundationModels", "bedrock:GetFoundationModel"]
        Resource = "*"
      }
    ]
  })
}

# Security Group
resource "aws_security_group" "main" {
  name        = "rfsbase-${var.environment}"
  description = "HTTP/HTTPS only, SSM for access"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 Instance
resource "aws_instance" "main" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = data.aws_subnets.default.ids[0]
  vpc_security_group_ids = [aws_security_group.main.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2.name

  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 2  # Allow Docker containers to access IMDS
  }

  root_block_device {
    volume_size           = var.volume_size
    volume_type           = "gp3"
    iops                  = var.volume_iops
    throughput            = var.volume_throughput
    encrypted             = true
    delete_on_termination = true
  }

  user_data = base64encode(templatefile("${path.module}/user-data.tftpl", {
    environment         = var.environment
    ssh_public_key      = var.ssh_public_key
    backup_bucket       = aws_s3_bucket.backups.id
    use_secrets_manager = var.use_secrets_manager
    secrets_arn         = var.use_secrets_manager ? aws_secretsmanager_secret.main[0].arn : ""
    aws_region          = var.aws_region
    domain              = var.domain != "" ? var.domain : "localhost"
  }))

  tags = { Name = "rfsbase-${var.environment}" }

  lifecycle { create_before_destroy = true }
}

resource "aws_eip" "main" {
  count    = var.use_elastic_ip ? 1 : 0
  instance = aws_instance.main.id
  domain   = "vpc"
}

# CloudWatch
resource "aws_cloudwatch_log_group" "main" {
  name              = "/rfsbase/${var.environment}"
  retention_in_days = 30
}

# Secrets Manager
resource "random_password" "secrets" {
  for_each = var.use_secrets_manager ? toset(["jwt", "auth", "db"]) : toset([])
  length   = 48
  special  = false
}

resource "aws_secretsmanager_secret" "main" {
  count = var.use_secrets_manager ? 1 : 0
  name  = "rfsbase/${var.environment}/secrets"
}

resource "aws_secretsmanager_secret_version" "main" {
  count     = var.use_secrets_manager ? 1 : 0
  secret_id = aws_secretsmanager_secret.main[0].id
  secret_string = jsonencode({
    JWT_SECRET         = random_password.secrets["jwt"].result
    BETTER_AUTH_SECRET = random_password.secrets["auth"].result
    SURREAL_PASS       = random_password.secrets["db"].result
    OPENAI_API_KEY     = var.openai_api_key
    RESEND_API_KEY     = var.resend_api_key
  })
}

resource "aws_iam_role_policy" "secrets" {
  count = var.use_secrets_manager ? 1 : 0
  name  = "secrets-read"
  role  = aws_iam_role.ec2.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["secretsmanager:GetSecretValue"]
      Resource = [aws_secretsmanager_secret.main[0].arn]
    }]
  })
}

# S3 Backups
resource "aws_s3_bucket" "backups" {
  bucket = "rfsbase-${var.environment}-backups-${data.aws_caller_identity.current.account_id}"
}

resource "aws_s3_bucket_versioning" "backups" {
  bucket = aws_s3_bucket.backups.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id
  rule {
    id     = "backup-retention"
    status = "Enabled"
    filter { prefix = "daily/" }
    transition {
      days          = 14
      storage_class = "GLACIER_IR"
    }
    expiration { days = 90 }
    abort_incomplete_multipart_upload { days_after_initiation = 1 }
  }
}

resource "aws_s3_bucket_public_access_block" "backups" {
  bucket                  = aws_s3_bucket.backups.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_iam_role_policy" "backups" {
  name = "s3-backups"
  role = aws_iam_role.ec2.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:PutObject", "s3:GetObject", "s3:ListBucket", "s3:DeleteObject"]
      Resource = [aws_s3_bucket.backups.arn, "${aws_s3_bucket.backups.arn}/*"]
    }]
  })
}

# =============================================================================
# Lambda for Embeddings (Bedrock)
# =============================================================================

# IAM Role for Lambda
resource "aws_iam_role" "lambda_embeddings" {
  name = "rfsbase-${var.environment}-lambda-embeddings"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_embeddings.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_bedrock" {
  name = "bedrock-invoke"
  role = aws_iam_role.lambda_embeddings.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ]
      Resource = [
        "arn:aws:bedrock:*::foundation-model/amazon.titan-embed-text-v2:0",
        "arn:aws:bedrock:*::foundation-model/amazon.titan-embed-*"
      ]
    }]
  })
}

# Lambda Function - install dependencies before zipping
resource "null_resource" "lambda_embeddings_deps" {
  triggers = {
    package_json = filemd5("${path.module}/../lambda/embeddings/package.json")
  }
  provisioner "local-exec" {
    command     = "npm install --production"
    working_dir = "${path.module}/../lambda/embeddings"
  }
}

data "archive_file" "lambda_embeddings" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/embeddings"
  output_path = "${path.module}/../lambda/embeddings.zip"
  depends_on  = [null_resource.lambda_embeddings_deps]
}

resource "aws_lambda_function" "embeddings" {
  filename         = data.archive_file.lambda_embeddings.output_path
  function_name    = "rfsbase-${var.environment}-embeddings"
  role             = aws_iam_role.lambda_embeddings.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  source_code_hash = data.archive_file.lambda_embeddings.output_base64sha256
  timeout          = 60
  memory_size      = 256

  environment {
    variables = {
      BEDROCK_REGION = var.aws_region
      BEDROCK_MODEL  = "amazon.titan-embed-text-v2:0"
      SURREAL_URL    = var.surreal_url
      SURREAL_NS     = "rfsbase"
      SURREAL_DB     = "main"
      SURREAL_USER   = "root"
      SURREAL_PASS   = var.surreal_pass
      API_KEY        = random_password.embeddings_api_key.result
    }
  }
}

# API Key for Lambda authentication
resource "random_password" "embeddings_api_key" {
  length  = 32
  special = false
}

# API Gateway (HTTP API)
resource "aws_apigatewayv2_api" "embeddings" {
  name          = "rfsbase-${var.environment}-embeddings"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["POST", "GET", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
  }
}

resource "aws_apigatewayv2_stage" "embeddings" {
  api_id      = aws_apigatewayv2_api.embeddings.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "embeddings" {
  api_id                 = aws_apigatewayv2_api.embeddings.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.embeddings.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "embeddings" {
  api_id    = aws_apigatewayv2_api.embeddings.id
  route_key = "POST /"
  target    = "integrations/${aws_apigatewayv2_integration.embeddings.id}"
}

resource "aws_apigatewayv2_route" "embeddings_health" {
  api_id    = aws_apigatewayv2_api.embeddings.id
  route_key = "GET /health"
  target    = "integrations/${aws_apigatewayv2_integration.embeddings.id}"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.embeddings.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.embeddings.execution_arn}/*/*"
}
