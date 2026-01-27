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
  default     = "t3.medium"

  validation {
    condition     = can(regex("^t3\\.(micro|small|medium|large)$", var.instance_type))
    error_message = "Instance type must be t3.micro, t3.small, t3.medium, or t3.large."
  }
}

variable "volume_size" {
  description = "Root EBS volume size in GB"
  type        = number
  default     = 25

  validation {
    condition     = var.volume_size >= 20 && var.volume_size <= 100
    error_message = "Volume size must be between 20 and 100 GB."
  }
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
  description = "SSH public key for EC2 access via SSM (optional)"
  type        = string
  default     = ""
}
