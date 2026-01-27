# RFSbase Terraform Outputs

output "instance_id" {
  description = "EC2 Instance ID"
  value       = aws_instance.rfsbase.id
}

output "public_ip" {
  description = "Public IP address"
  value       = var.use_elastic_ip ? aws_eip.rfsbase[0].public_ip : aws_instance.rfsbase.public_ip
}

output "public_dns" {
  description = "Public DNS name"
  value       = aws_instance.rfsbase.public_dns
}

output "security_group_id" {
  description = "Security Group ID"
  value       = aws_security_group.rfsbase.id
}

output "iam_role_arn" {
  description = "IAM Role ARN"
  value       = aws_iam_role.ec2_role.arn
}

output "ssm_connect_command" {
  description = "Command to connect via SSM Session Manager"
  value       = "aws ssm start-session --target ${aws_instance.rfsbase.id} --region ${var.aws_region}"
}

output "ssh_config_entry" {
  description = "SSH config entry for SSM proxy"
  value       = <<-EOT
    # Add this to ~/.ssh/config
    Host rfsbase
        HostName ${aws_instance.rfsbase.id}
        User ec2-user
        ProxyCommand aws ssm start-session --target %h --document-name AWS-StartSSHSession --parameters portNumber=%p --region ${var.aws_region}
        StrictHostKeyChecking accept-new
        ServerAliveInterval 30
        ServerAliveCountMax 3
  EOT
}

output "app_url" {
  description = "Application URL"
  value       = var.domain != "" ? "https://${var.domain}" : "http://${var.use_elastic_ip ? aws_eip.rfsbase[0].public_ip : aws_instance.rfsbase.public_ip}"
}
