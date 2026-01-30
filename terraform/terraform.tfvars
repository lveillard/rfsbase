aws_region          = "us-east-1"
environment         = "prod"
instance_type       = "t3.xlarge"
volume_size         = 50
volume_iops         = 6000
volume_throughput   = 400
use_elastic_ip      = true
domain              = "rfsbase.com"
use_secrets_manager = false

# Pass sensitive values via TF_VAR_* environment variables:
# export TF_VAR_ssh_public_key="ssh-ed25519 ..."
# export TF_VAR_openai_api_key="sk-..."
# export TF_VAR_resend_api_key="re_..."
# export TF_VAR_surreal_url="https://rfsbase.com"  # SurrealDB HTTP endpoint
# export TF_VAR_surreal_pass="your-surreal-password"
