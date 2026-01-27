# RFSbase EC2 Deployment Guide

## Quick Deploy

### 1. Launch EC2 Instance

**Recommended specs:**
- **Instance type:** t3.medium (4GB RAM, 2 vCPU) - recommended for production
- **Alternative:** t3.small (2GB RAM) - minimum for testing
- **AMI:** Amazon Linux 2023 or Ubuntu 22.04/24.04
- **Storage:** 20GB+ gp3 SSD

**Security Group rules (inbound):**
| Port | Protocol | Source | Description |
|------|----------|--------|-------------|
| 22 | TCP | Your IP | SSH access |
| 80 | TCP | 0.0.0.0/0 | HTTP (redirects to HTTPS later) |
| 443 | TCP | 0.0.0.0/0 | HTTPS (when domain configured) |
| 3000 | TCP | 0.0.0.0/0 | Frontend (IP mode) |
| 3001 | TCP | 0.0.0.0/0 | API (IP mode) |

### 2. SSH into your instance

```bash
ssh -i your-key.pem ec2-user@YOUR_EC2_IP
# or for Ubuntu:
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
```

### 3. Run the setup script

```bash
# One-liner install (fetches and runs setup script)
curl -fsSL https://raw.githubusercontent.com/lveillard/rfsbase/main/deploy/ec2-setup.sh | bash
```

Or manually:
```bash
git clone https://github.com/lveillard/rfsbase.git
cd rfsbase
chmod +x deploy/ec2-setup.sh
./deploy/ec2-setup.sh
```

### 4. Access your app

After deployment completes:
- Frontend: `http://YOUR_EC2_IP:3000`
- API: `http://YOUR_EC2_IP:3001`
- SurrealDB: `http://YOUR_EC2_IP:8000`

---

## Adding Your Domain (rfsbase.com)

When you're ready to use your domain:

### 1. Configure DNS

Add these DNS records pointing to your EC2 public IP:
```
rfsbase.com      A    YOUR_EC2_IP
api.rfsbase.com  A    YOUR_EC2_IP
```

### 2. Run domain configuration

```bash
cd ~/rfsbase
./deploy/configure-domain.sh rfsbase.com
```

This will:
- Update environment to use HTTPS URLs
- Rebuild the frontend with new URLs
- Switch to production docker-compose with Caddy reverse proxy
- Automatically provision SSL certificates via Let's Encrypt

---

## Management Commands

```bash
cd ~/rfsbase

# View logs
docker compose -f docker-compose.ec2.yml logs -f

# View specific service logs
docker compose -f docker-compose.ec2.yml logs -f frontend
docker compose -f docker-compose.ec2.yml logs -f backend
docker compose -f docker-compose.ec2.yml logs -f surrealdb

# Restart services
docker compose -f docker-compose.ec2.yml restart

# Stop services
docker compose -f docker-compose.ec2.yml down

# Start services
docker compose -f docker-compose.ec2.yml up -d

# Rebuild and restart (after code changes)
git pull
docker compose -f docker-compose.ec2.yml build
docker compose -f docker-compose.ec2.yml up -d

# View service status
docker compose -f docker-compose.ec2.yml ps
```

---

## Environment Variables

Edit `.env` file to configure:

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Enable AI features (idea refinement, semantic search) |
| `GOOGLE_CLIENT_ID/SECRET` | Enable Google OAuth login |
| `GITHUB_CLIENT_ID/SECRET` | Enable GitHub OAuth login |
| `RESEND_API_KEY` | Enable magic link email authentication |

After changing `.env`:
```bash
docker compose -f docker-compose.ec2.yml up -d
```

---

## Troubleshooting

### Docker not running
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### Permission denied for Docker
```bash
sudo usermod -aG docker $USER
# Log out and back in
```

### Frontend shows wrong API URL
The `NEXT_PUBLIC_*` variables are baked at build time. Rebuild:
```bash
docker compose -f docker-compose.ec2.yml build frontend
docker compose -f docker-compose.ec2.yml up -d
```

### Database connection issues
Check SurrealDB is healthy:
```bash
docker compose -f docker-compose.ec2.yml logs surrealdb
curl http://localhost:8000/health
```

### Out of memory
Upgrade to a larger instance or reduce memory limits in docker-compose.

---

## Backup & Restore

### Backup database
```bash
docker exec rfsbase-db surreal export --conn http://localhost:8000 --user root --pass YOUR_PASS --ns rfsbase --db main > backup.surql
```

### Restore database
```bash
docker exec -i rfsbase-db surreal import --conn http://localhost:8000 --user root --pass YOUR_PASS --ns rfsbase --db main < backup.surql
```

---

## Cost Estimate (AWS)

| Resource | Monthly Cost (us-east-1) |
|----------|-------------------------|
| t3.medium (on-demand) | ~$30 |
| t3.small (on-demand) | ~$15 |
| 20GB gp3 storage | ~$2 |
| Data transfer | Variable |

**Tip:** Use Reserved Instances or Savings Plans for 30-60% savings.
