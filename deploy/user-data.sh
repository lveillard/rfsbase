#!/bin/bash
set -e

# Log everything
exec > >(tee /var/log/rfsbase-setup.log) 2>&1
echo "Starting RFSbase setup at $(date)"

# Install Docker
yum update -y
yum install -y docker git

# Start Docker
systemctl start docker
systemctl enable docker
usermod -aG docker ec2-user

# Install Docker Compose plugin
mkdir -p /usr/local/lib/docker/cli-plugins
COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep '"tag_name":' | sed -E 's/.*"v([^"]+)".*/\1/')
curl -SL "https://github.com/docker/compose/releases/download/v${COMPOSE_VERSION}/docker-compose-linux-x86_64" -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Get public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "Public IP: $PUBLIC_IP"

# Clone repository
cd /home/ec2-user
sudo -u ec2-user git clone https://github.com/lveillard/rfsbase.git
cd rfsbase

# Generate secrets
generate_secret() {
    openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 48
}

JWT_SECRET=$(generate_secret)
BETTER_AUTH_SECRET=$(generate_secret)
SURREAL_PASS=$(generate_secret)

# Create .env file (secure config - all through Caddy proxy)
cat > .env << EOF
NODE_ENV=production
APP_URL=http://${PUBLIC_IP}
API_URL=http://${PUBLIC_IP}/api
NEXT_PUBLIC_APP_URL=http://${PUBLIC_IP}
NEXT_PUBLIC_API_URL=/api
SURREAL_URL=ws://surrealdb:8000
SURREAL_NS=rfsbase
SURREAL_DB=main
SURREAL_USER=root
SURREAL_PASS=${SURREAL_PASS}
JWT_SECRET=${JWT_SECRET}
BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
RESEND_API_KEY=
FROM_EMAIL=noreply@rfsbase.com
OPENAI_API_KEY=
REGISTRY=rfsbase
TAG=latest
EOF

# Save credentials
cat > /home/ec2-user/rfsbase-credentials.txt << EOF
RFSbase Credentials - SAVE THESE!
==================================
SURREAL_PASS: ${SURREAL_PASS}
JWT_SECRET: ${JWT_SECRET}
BETTER_AUTH_SECRET: ${BETTER_AUTH_SECRET}
==================================
EOF
chmod 600 /home/ec2-user/rfsbase-credentials.txt
chown ec2-user:ec2-user /home/ec2-user/rfsbase-credentials.txt

# Fix ownership
chown -R ec2-user:ec2-user /home/ec2-user/rfsbase

# Build and start (as ec2-user with docker group)
sudo -u ec2-user docker compose -f docker-compose.ec2.yml build
sudo -u ec2-user docker compose -f docker-compose.ec2.yml up -d

echo "RFSbase setup complete at $(date)"
echo "Frontend: http://${PUBLIC_IP}:3000"
echo "API: http://${PUBLIC_IP}:3001"
