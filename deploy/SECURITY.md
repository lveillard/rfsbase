# RFSbase Security Configuration

## Architecture Overview

```
Internet                         EC2 Instance
   │                    ┌─────────────────────────────────┐
   │                    │                                 │
   ├──── :22 (SSH) ────►│  SSH (key-based auth only)     │
   │                    │                                 │
   │                    │  ┌─────────────────────────┐   │
   ├──── :80/:443 ─────►│  │   Caddy (reverse proxy) │   │
   │                    │  │   - Rate limiting       │   │
   │                    │  │   - Security headers    │   │
   │                    │  │   - Auto SSL (HTTPS)    │   │
   │                    │  └──────────┬──────────────┘   │
   │                    │             │                   │
   │                    │    Internal Network Only        │
   │                    │             │                   │
   │                    │  ┌──────────▼──────────────┐   │
   │         ╳          │  │  Frontend (Next.js)     │   │
   │     blocked        │  │  :3000 internal only    │   │
   │                    │  └──────────┬──────────────┘   │
   │                    │             │                   │
   │                    │  ┌──────────▼──────────────┐   │
   │         ╳          │  │  Backend API (Rust)     │   │
   │     blocked        │  │  :3001 internal only    │   │
   │                    │  └──────────┬──────────────┘   │
   │                    │             │                   │
   │                    │  ┌──────────▼──────────────┐   │
   │         ╳          │  │  SurrealDB              │   │
   │     blocked        │  │  :8000 internal only    │   │
   │                    │  └─────────────────────────┘   │
   │                    │                                 │
   │                    └─────────────────────────────────┘
```

## Security Measures Implemented

### 1. Network Security (AWS Security Groups)

Only exposed ports:
| Port | Service | Access |
|------|---------|--------|
| 22 | SSH | Your IP only (recommended) |
| 80 | HTTP | Public (redirects to HTTPS) |
| 443 | HTTPS | Public |

**Blocked:**
- Port 3000 (Frontend) - internal only
- Port 3001 (API) - internal only
- Port 8000 (SurrealDB) - internal only

### 2. Container Security

All containers run with:
- `security_opt: no-new-privileges:true` - Prevents privilege escalation
- `read_only: true` (API) - Immutable filesystem
- Resource limits - Prevents resource exhaustion attacks
- Non-root users - Containers don't run as root

### 3. Reverse Proxy (Caddy)

Security features:
- **Rate limiting** - 100 req/s per IP to prevent DDoS
- **Security headers:**
  - X-Frame-Options: DENY (clickjacking protection)
  - X-Content-Type-Options: nosniff (MIME sniffing protection)
  - X-XSS-Protection (XSS protection)
  - Content-Security-Policy (CSP)
  - Strict-Transport-Security (HSTS) when using HTTPS
- **Auto SSL** - Let's Encrypt certificates (when domain configured)
- **Admin API disabled** - No management endpoint exposed

### 4. Application Security

- **JWT authentication** - Secure token-based auth
- **Argon2 password hashing** - Industry-standard password security
- **CORS configured** - Only allows requests from trusted origins
- **Input validation** - All inputs validated before processing

### 5. Database Security

- **Internal network only** - No public access
- **Strong password** - Auto-generated 48-char password
- **No default credentials** - Unique credentials per deployment

## Security Checklist

### Before Production

- [ ] Restrict SSH (port 22) to your IP only:
  ```bash
  aws ec2 revoke-security-group-ingress --group-id sg-xxx --protocol tcp --port 22 --cidr 0.0.0.0/0
  aws ec2 authorize-security-group-ingress --group-id sg-xxx --protocol tcp --port 22 --cidr YOUR_IP/32
  ```

- [ ] Configure proper domain and enable HTTPS

- [ ] Set up AWS CloudWatch monitoring

- [ ] Enable AWS GuardDuty for threat detection

- [ ] Configure backup for SurrealDB data

- [ ] Review and rotate secrets regularly

- [ ] Set up fail2ban for SSH protection

### Optional Enhancements

1. **AWS WAF** - Web Application Firewall for additional protection
2. **AWS Shield** - DDoS protection
3. **VPC with private subnets** - Full network isolation
4. **AWS Secrets Manager** - Centralized secrets management
5. **CloudFront** - CDN with edge security

## Incident Response

### If you suspect a breach:

1. **Isolate** - Remove security group rules to stop traffic
   ```bash
   aws ec2 revoke-security-group-ingress --group-id sg-xxx --protocol tcp --port 80 --cidr 0.0.0.0/0
   ```

2. **Investigate** - Check logs
   ```bash
   docker logs rfsbase-proxy  # Caddy access logs
   docker logs rfsbase-api    # API logs
   ```

3. **Rotate credentials**
   ```bash
   # Generate new secrets and update .env
   # Rebuild and restart containers
   ```

## Secrets Management

Credentials stored in `/home/ec2-user/rfsbase-credentials.txt`:
- SURREAL_PASS
- JWT_SECRET
- BETTER_AUTH_SECRET

**Best practices:**
- Store backup in AWS Secrets Manager
- Rotate every 90 days
- Never commit to git
