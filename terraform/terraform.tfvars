# RFSbase Production Configuration

aws_region        = "us-east-1"
environment       = "prod"
instance_type     = "t3.xlarge"    # 16GB RAM, 4 vCPUs
volume_size       = 50             # 50GB for SurrealDB + apps
volume_iops       = 6000           # High IOPS for database
volume_throughput = 400            # 400 MB/s throughput
use_elastic_ip    = true
domain            = "rfsbase.com"

ssh_public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIng9peWSvtTG1O8hxnp9K4MjAbTQx74uaoMjO5gzRlJ lveil@ec2-dev"
