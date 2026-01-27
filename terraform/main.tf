# RFSbase Infrastructure - Terraform
#
# Features:
# - SSM Session Manager (no SSH port exposed)
# - Encrypted EBS volumes
# - IMDSv2 required
# - Minimal security group (only 80/443)
# - IAM role with least privilege

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Optional: Remote state in S3
  # backend "s3" {
  #   bucket = "rfsbase-terraform-state"
  #   key    = "prod/terraform.tfstate"
  #   region = "us-east-1"
  # }
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

# =============================================================================
# Data Sources
# =============================================================================

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023*-x86_64"]
  }

  filter {
    name   = "state"
    values = ["available"]
  }
}

# =============================================================================
# IAM Role for EC2 (SSM + CloudWatch)
# =============================================================================

resource "aws_iam_role" "ec2_role" {
  name = "rfsbase-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# SSM managed policy - allows Session Manager access
resource "aws_iam_role_policy_attachment" "ssm_policy" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# CloudWatch agent policy - for logs and metrics
resource "aws_iam_role_policy_attachment" "cloudwatch_policy" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "rfsbase-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

# =============================================================================
# Security Group - Minimal exposure
# =============================================================================

resource "aws_security_group" "rfsbase" {
  name        = "rfsbase-sg"
  description = "RFSbase security group - minimal exposure"
  vpc_id      = data.aws_vpc.default.id

  # HTTP - for Caddy (redirects to HTTPS when domain configured)
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS - for Caddy with SSL
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # NO SSH port - using SSM Session Manager instead

  # Egress - allow all outbound
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "rfsbase-sg"
  }
}

# =============================================================================
# EC2 Instance
# =============================================================================

resource "aws_instance" "rfsbase" {
  ami                    = data.aws_ami.amazon_linux_2023.id
  instance_type          = var.instance_type
  subnet_id              = data.aws_subnets.default.ids[0]
  vpc_security_group_ids = [aws_security_group.rfsbase.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  # Security: Require IMDSv2
  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
  }

  # Encrypted root volume
  root_block_device {
    volume_size           = var.volume_size
    volume_type           = "gp3"
    encrypted             = true
    delete_on_termination = true

    tags = {
      Name = "rfsbase-root"
    }
  }

  # User data script for setup
  user_data = base64encode(templatefile("${path.module}/user-data.tftpl", {
    environment = var.environment
  }))

  tags = {
    Name = "rfsbase-${var.environment}"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# =============================================================================
# Elastic IP (optional - for static IP)
# =============================================================================

resource "aws_eip" "rfsbase" {
  count    = var.use_elastic_ip ? 1 : 0
  instance = aws_instance.rfsbase.id
  domain   = "vpc"

  tags = {
    Name = "rfsbase-eip"
  }
}

# =============================================================================
# CloudWatch Log Group
# =============================================================================

resource "aws_cloudwatch_log_group" "rfsbase" {
  name              = "/rfsbase/${var.environment}"
  retention_in_days = 30

  tags = {
    Name = "rfsbase-logs"
  }
}
