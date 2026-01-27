variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "environment" {
  type    = string
  default = "prod"
}

variable "instance_type" {
  type    = string
  default = "t3.xlarge"
}

variable "volume_size" {
  type    = number
  default = 50
}

variable "volume_iops" {
  type    = number
  default = 6000
}

variable "volume_throughput" {
  type    = number
  default = 400
}

variable "use_elastic_ip" {
  type    = bool
  default = true
}

variable "domain" {
  type    = string
  default = ""
}

variable "ssh_public_key" {
  type      = string
  default   = ""
  sensitive = true
}

variable "use_secrets_manager" {
  type    = bool
  default = true
}

variable "openai_api_key" {
  type      = string
  default   = ""
  sensitive = true
}

variable "resend_api_key" {
  type      = string
  default   = ""
  sensitive = true
}
