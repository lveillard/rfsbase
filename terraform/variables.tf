# RFSbase Terraform Variables

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (prod, staging, dev)"
  type        = string
  default     = "prod"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.xlarge"  # 16GB RAM - good for SurrealDB + multiple apps
}

variable "volume_size" {
  description = "Root EBS volume size in GB"
  type        = number
  default     = 50
}

variable "volume_iops" {
  description = "gp3 IOPS (baseline 3000, max 16000)"
  type        = number
  default     = 6000
}

variable "volume_throughput" {
  description = "gp3 throughput in MB/s (baseline 125, max 1000)"
  type        = number
  default     = 400
}

variable "use_elastic_ip" {
  description = "Whether to assign an Elastic IP (static IP)"
  type        = bool
  default     = true
}

variable "domain" {
  description = "Domain name for the application (optional)"
  type        = string
  default     = ""
}

variable "ssh_public_key" {
  description = "SSH public key for ubuntu user (SSH-over-SSM access)"
  type        = string
  default     = ""
}
