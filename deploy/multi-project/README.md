# Multi-Project EC2 Setup

Run multiple projects on a single EC2 instance using a shared reverse proxy.

## Architecture

```
                    ┌─────────────────────────────────────────────┐
                    │                   EC2                        │
Internet ──────────►│                                             │
    :80/:443        │   ┌─────────────┐                           │
                    │   │   Caddy     │                           │
                    │   │   (proxy)   │                           │
                    │   └──────┬──────┘                           │
                    │          │                                   │
                    │    shared-proxy network                      │
                    │          │                                   │
          ┌────────┼──────────┼──────────┬───────────────────────┤
          │        │          │          │                        │
          ▼        │          ▼          │          ▼             │
    ┌──────────┐   │    ┌──────────┐     │    ┌──────────┐        │
    │ rfsbase  │   │    │ project2 │     │    │ project3 │        │
    │ -web     │   │    │ -web     │     │    │ -web     │        │
    │ -api     │   │    │ -api     │     │    │ -api     │        │
    │ -db      │   │    │ -db      │     │    │ -db      │        │
    └──────────┘   │    └──────────┘     │    └──────────┘        │
     internal      │     internal        │     internal           │
     network       │     network         │     network            │
                   └─────────────────────┴────────────────────────┘
```

## Setup

### 1. Start the shared proxy

```bash
cd ~/rfsbase/deploy/multi-project
docker compose -f docker-compose.shared.yml up -d
```

### 2. Start RFSbase

```bash
cd ~/rfsbase
docker compose -f docker-compose.multi.yml up -d
```

### 3. Add another project

For each new project:

1. Clone the project repo
2. Create a docker-compose that:
   - Uses `expose` instead of `ports` (internal only)
   - Connects to `shared-proxy` network (external: true)
   - Has its own internal network for DB
3. Add routing rules to `Caddyfile`
4. Reload Caddy: `docker exec shared-proxy caddy reload --config /etc/caddy/Caddyfile`

## Example: Adding a new project

### Project's docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    image: myproject/web
    container_name: myproject-web
    expose:
      - "3000"
    networks:
      - myproject-internal
      - shared-proxy

  api:
    image: myproject/api
    container_name: myproject-api
    expose:
      - "4000"
    networks:
      - myproject-internal
      - shared-proxy

  db:
    image: postgres:16
    container_name: myproject-db
    expose:
      - "5432"
    networks:
      - myproject-internal  # DB only on internal network

networks:
  myproject-internal:
    name: myproject-internal
  shared-proxy:
    external: true
```

### Add to Caddyfile

```
myproject.com {
    reverse_proxy myproject-web:3000
    encode gzip
}

api.myproject.com {
    reverse_proxy myproject-api:4000
    encode gzip
}
```

### Reload Caddy

```bash
docker exec shared-proxy caddy reload --config /etc/caddy/Caddyfile
```

## Security Benefits

- **Databases isolated**: Each project's DB is only accessible within its internal network
- **Single entry point**: Only Caddy is exposed to the internet
- **Automatic SSL**: Caddy handles Let's Encrypt certificates for all domains
- **No port conflicts**: Each project uses internal ports, proxy routes by domain

## Commands

```bash
# View all running containers
docker ps

# View logs for shared proxy
docker logs -f shared-proxy

# Reload Caddy config (after editing Caddyfile)
docker exec shared-proxy caddy reload --config /etc/caddy/Caddyfile

# View which networks exist
docker network ls

# Inspect shared-proxy network
docker network inspect shared-proxy
```

## DNS Setup

For each project, add A records pointing to your EC2 public IP:

```
rfsbase.com      A    <EC2-IP>
api.rfsbase.com  A    <EC2-IP>
myproject.com    A    <EC2-IP>
api.myproject.com A   <EC2-IP>
```

Caddy will automatically provision SSL certificates once DNS propagates.
