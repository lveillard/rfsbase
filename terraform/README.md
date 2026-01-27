# RFSbase Terraform Infrastructure

Infrastructure as Code for deploying RFSbase on AWS.

## Features

- **SSM Session Manager** - No SSH port exposed, access via AWS SSM
- **Encrypted EBS** - All volumes encrypted at rest
- **IMDSv2 Required** - More secure instance metadata
- **Minimal Security Group** - Only ports 80/443 exposed
- **Elastic IP** - Static IP for DNS (optional)
- **CloudWatch Logs** - Centralized logging

## Prerequisites

1. AWS CLI configured with appropriate credentials
2. Terraform >= 1.0 installed
3. Session Manager plugin installed for SSH via SSM:
   ```bash
   # macOS
   brew install --cask session-manager-plugin

   # Windows (run as admin)
   winget install Amazon.SessionManagerPlugin
   ```

## Quick Start

```bash
cd terraform

# Initialize terraform
terraform init

# Preview changes
terraform plan

# Apply infrastructure
terraform apply
```

## Connect via SSM

After `terraform apply`, you'll get outputs including:

```bash
# Direct SSM session (shell access)
aws ssm start-session --target i-xxxx --region us-east-1

# Or add to ~/.ssh/config for SSH-like access
# (copy the ssh_config_entry output)
```

Then you can use:
```bash
ssh rfsbase
```

## Configuration

Edit `terraform.tfvars`:

```hcl
aws_region     = "us-east-1"    # AWS region
environment    = "prod"          # Environment name
instance_type  = "t3.medium"     # EC2 instance type
volume_size    = 25              # Root volume size (GB)
use_elastic_ip = true            # Static IP for DNS
domain         = "rfsbase.com"   # Your domain (when ready)
```

## Architecture

```
                    Internet
                        │
                        ▼
              ┌─────────────────┐
              │   Elastic IP    │
              │  (optional)     │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  Security Group │
              │  :80, :443 only │
              │  (no SSH)       │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │   EC2 Instance  │
              │   - SSM Agent   │
              │   - Docker      │
              │   - IMDSv2      │
              │   - Encrypted   │
              └─────────────────┘
                       │
              ┌────────▼────────┐
              │  IAM Role       │
              │  - SSM Access   │
              │  - CloudWatch   │
              └─────────────────┘
```

## Security Best Practices

1. **No SSH port** - Use SSM Session Manager instead
2. **IAM-based access** - No SSH keys to manage
3. **Audit trail** - All SSM sessions logged in CloudTrail
4. **Encryption** - EBS volumes encrypted by default
5. **IMDSv2** - Prevents SSRF attacks on metadata service

## Destroy

```bash
terraform destroy
```

## State Management

For team use, configure remote state in `main.tf`:

```hcl
terraform {
  backend "s3" {
    bucket = "your-terraform-state-bucket"
    key    = "rfsbase/terraform.tfstate"
    region = "us-east-1"
  }
}
```
