output "instance_id" {
  value = aws_instance.main.id
}

output "public_ip" {
  value = var.use_elastic_ip ? aws_eip.main[0].public_ip : aws_instance.main.public_ip
}

output "ssm_command" {
  value = "aws ssm start-session --target ${aws_instance.main.id} --region ${var.aws_region}"
}

output "app_url" {
  value = var.domain != "" ? "https://${var.domain}" : "http://${var.use_elastic_ip ? aws_eip.main[0].public_ip : aws_instance.main.public_ip}"
}

output "backup_bucket" {
  value = aws_s3_bucket.backups.id
}

output "secrets_arn" {
  value = var.use_secrets_manager ? aws_secretsmanager_secret.main[0].arn : null
}

output "embeddings_api_url" {
  description = "Lambda embeddings API Gateway URL"
  value       = aws_apigatewayv2_api.embeddings.api_endpoint
}
