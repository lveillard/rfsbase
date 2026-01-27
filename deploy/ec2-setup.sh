#!/bin/bash
set -e

# =============================================================================
# RFSbase EC2 Deployment Script
# =============================================================================
# This script sets up a fresh EC2 instance with Docker and deploys RFSbase
#
# Supported: Amazon Linux 2023, Ubuntu 22.04/24.04
# Recommended Instance: t3.medium (4GB RAM, 2 vCPU) or t3.small (2GB RAM)
#
# Usage:
#   1. Launch EC2 instance (see recommended specs below)
#   2. SSH into instance: ssh -i your-key.pem ec2-user@your-ip
#   3. Run: curl -fsSL https://raw.githubusercontent.com/lveillard/rfsbase/main/deploy/ec2-setup.sh | bash
#   Or clone repo and run: ./deploy/ec2-setup.sh
# =============================================================================

echo "=========================================="
echo "RFSbase EC2 Deployment Setup"
echo "=========================================="

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    echo "Cannot detect OS. Exiting."
    exit 1
fi

echo "Detected OS: $OS"

# Install Docker based on OS
install_docker() {
    case $OS in
        amzn)
            echo "Installing Docker on Amazon Linux..."
            sudo yum update -y
            sudo yum install -y docker git
            sudo systemctl start docker
            sudo systemctl enable docker
            sudo usermod -aG docker $USER

            # Install Docker Compose plugin
            sudo mkdir -p /usr/local/lib/docker/cli-plugins
            COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep '"tag_name":' | sed -E 's/.*"v([^"]+)".*/\1/')
            sudo curl -SL "https://github.com/docker/compose/releases/download/v${COMPOSE_VERSION}/docker-compose-linux-x86_64" -o /usr/local/lib/docker/cli-plugins/docker-compose
            sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
            ;;
        ubuntu)
            echo "Installing Docker on Ubuntu..."
            sudo apt-get update
            sudo apt-get install -y ca-certificates curl gnupg git
            sudo install -m 0755 -d /etc/apt/keyrings
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
            sudo chmod a+r /etc/apt/keyrings/docker.gpg
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            sudo apt-get update
            sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
            sudo usermod -aG docker $USER
            ;;
        *)
            echo "Unsupported OS: $OS"
            echo "Please install Docker manually and re-run this script."
            exit 1
            ;;
    esac
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    install_docker
    echo ""
    echo "Docker installed! Please log out and back in for group changes to take effect."
    echo "Then run this script again to continue setup."
    exit 0
fi

# Verify Docker is running
if ! docker info &> /dev/null; then
    echo "Docker is not running or you don't have permission."
    echo "Try: sudo systemctl start docker"
    echo "And ensure your user is in the docker group: sudo usermod -aG docker $USER"
    exit 1
fi

echo "Docker is ready!"

# Get EC2 public IP
echo ""
echo "Getting EC2 public IP..."
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || curl -s ifconfig.me 2>/dev/null || echo "")

if [ -z "$PUBLIC_IP" ]; then
    echo "Could not auto-detect public IP."
    read -p "Enter your EC2 public IP: " PUBLIC_IP
fi

echo "Using public IP: $PUBLIC_IP"

# Clone or update repository
REPO_DIR="/home/$USER/rfsbase"

if [ -d "$REPO_DIR" ]; then
    echo "Repository exists, pulling latest..."
    cd "$REPO_DIR"
    git pull
else
    echo "Cloning repository..."
    git clone https://github.com/lveillard/rfsbase.git "$REPO_DIR"
    cd "$REPO_DIR"
fi

# Generate secure passwords/secrets
generate_secret() {
    openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 48
}

JWT_SECRET=$(generate_secret)
BETTER_AUTH_SECRET=$(generate_secret)
SURREAL_PASS=$(generate_secret)

# Create production .env file
echo "Creating production environment file..."
cat > "$REPO_DIR/.env" << EOF
# RFSbase Production Environment
# Generated: $(date)

NODE_ENV=production

# URLs
APP_URL=http://${PUBLIC_IP}
API_URL=http://${PUBLIC_IP}:3001
NEXT_PUBLIC_APP_URL=http://${PUBLIC_IP}
NEXT_PUBLIC_API_URL=http://${PUBLIC_IP}:3001

# Database (SurrealDB)
SURREAL_URL=ws://surrealdb:8000
SURREAL_NS=rfsbase
SURREAL_DB=main
SURREAL_USER=root
SURREAL_PASS=${SURREAL_PASS}

# Auth
JWT_SECRET=${JWT_SECRET}
BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}

# OAuth (configure later)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Email (configure later)
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
RESEND_API_KEY=
FROM_EMAIL=noreply@rfsbase.com

# AI (optional)
OPENAI_API_KEY=

# Docker
REGISTRY=rfsbase
TAG=latest
EOF

echo ""
echo "Environment file created at $REPO_DIR/.env"
echo ""
echo "IMPORTANT: Save these credentials somewhere safe!"
echo "=========================================="
echo "SURREAL_PASS: $SURREAL_PASS"
echo "JWT_SECRET: $JWT_SECRET"
echo "BETTER_AUTH_SECRET: $BETTER_AUTH_SECRET"
echo "=========================================="
echo ""

# Build and start services
echo "Building Docker images (this may take 5-10 minutes)..."
cd "$REPO_DIR"
docker compose -f docker-compose.ec2.yml build

echo ""
echo "Starting services..."
docker compose -f docker-compose.ec2.yml up -d

# Wait for services to be healthy
echo ""
echo "Waiting for services to start..."
sleep 10

# Check status
echo ""
echo "Service status:"
docker compose -f docker-compose.ec2.yml ps

echo ""
echo "=========================================="
echo "DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "Frontend:  http://${PUBLIC_IP}:3000"
echo "API:       http://${PUBLIC_IP}:3001"
echo "SurrealDB: http://${PUBLIC_IP}:8000"
echo ""
echo "To view logs:"
echo "  docker compose -f docker-compose.ec2.yml logs -f"
echo ""
echo "To stop services:"
echo "  docker compose -f docker-compose.ec2.yml down"
echo ""
echo "When you get your domain (rfsbase.com), run:"
echo "  ./deploy/configure-domain.sh rfsbase.com"
echo ""
