# 🚀 TezCart Deployment Guide

## Production Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrated
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Error tracking setup
- [ ] SSL/TLS certificates
- [ ] CDN for static assets
- [ ] Database backups configured
- [ ] Monitoring setup

## Environment Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/tezcart

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRATION=7d

# Server
PORT=4000
NODE_ENV=production

# CORS (comma-separated)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Optional: Email (if using email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional: AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Optional: Payment Gateways
STRIPE_SECRET_KEY=sk_live_...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...

# Optional: Monitoring
SENTRY_DSN=https://...@sentry.io/...
```

## Hosting Options

### 1. Railway (Recommended for Quick Deploy)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Add environment variables through Railway dashboard
```

### 2. Render

```yaml
# render.yaml
services:
  - type: web
    name: tezcart-api
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm run start:prod
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: NODE_ENV
        value: production
```

### 3. Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Launch app
flyctl launch

# Set secrets
flyctl secrets set JWT_SECRET=your-secret-here
flyctl secrets set DATABASE_URL=postgresql://...

# Deploy
flyctl deploy
```

### 4. AWS (EC2 + RDS)

#### EC2 Setup

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone your-repo-url
cd backend

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start dist/main.js --name tezcart-api

# Save PM2 config
pm2 save
pm2 startup
```

#### RDS Setup

1. Create PostgreSQL RDS instance
2. Configure security groups
3. Use connection string in DATABASE_URL

### 5. Google Cloud Platform

```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash

# Initialize
gcloud init

# Deploy to App Engine
gcloud app deploy

# Set environment variables
gcloud app environment-variables set \
  DATABASE_URL="postgresql://..." \
  JWT_SECRET="your-secret"
```

## Database Hosting

### 1. Neon DB (Recommended - Serverless PostgreSQL)

```bash
# Sign up at neon.tech
# Create project
# Copy connection string
# Add to DATABASE_URL
```

### 2. Supabase

```bash
# Sign up at supabase.com
# Create project
# Get connection string from settings
# Add to DATABASE_URL
```

### 3. AWS RDS

- Choose PostgreSQL engine
- Select appropriate instance size
- Configure VPC and security groups
- Enable automated backups
- Use connection pooling (PgBouncer)

## Production Build

```bash
# Build the application
npm run build

# The build output is in dist/

# Run production server
npm run start:prod
```

## Process Manager (PM2)

```bash
# Install PM2
npm install -g pm2

# Start
pm2 start dist/main.js --name tezcart-api

# Monitor
pm2 monit

# Logs
pm2 logs tezcart-api

# Restart
pm2 restart tezcart-api

# Stop
pm2 stop tezcart-api

# Auto-restart on server reboot
pm2 startup
pm2 save
```

## Nginx Configuration

```nginx
# /etc/nginx/sites-available/tezcart-api

server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/tezcart-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL/TLS with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["node", "dist/main.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=tezcart
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

Deploy:
```bash
docker-compose up -d
```

## Monitoring & Logging

### Sentry (Error Tracking)

```bash
npm install @sentry/node

# Add to main.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Winston (Logging)

```bash
npm install winston

# Configure in logger.service.ts
```

### Health Check Endpoint

```typescript
// app.controller.ts
@Get('health')
healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
}
```

## Performance Optimization

### 1. Database Connection Pooling

```typescript
// data-source.ts
extra: {
  max: 20, // Maximum connections
  min: 5,  // Minimum connections
  idleTimeoutMillis: 30000,
}
```

### 2. Caching (Redis)

```bash
npm install @nestjs/cache-manager cache-manager
npm install cache-manager-redis-store
```

### 3. Rate Limiting

```bash
npm install @nestjs/throttler
```

### 4. Compression

```bash
npm install compression
```

## Backups

### Database Backups

```bash
# Manual backup
pg_dump -h hostname -U username -d tezcart > backup_$(date +%Y%m%d).sql

# Restore
psql -h hostname -U username -d tezcart < backup_file.sql

# Automated daily backups (cron)
0 2 * * * /path/to/backup-script.sh
```

### Automated Backup Script

```bash
#!/bin/bash
# backup-script.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="tezcart"

pg_dump -h $DB_HOST -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

## Security Checklist

- [x] Environment variables not committed
- [x] HTTPS enabled
- [x] CORS properly configured
- [x] Rate limiting enabled
- [x] SQL injection protection (TypeORM)
- [x] XSS protection
- [x] Helmet middleware
- [x] Strong JWT secret
- [x] Password hashing (bcrypt)
- [x] Input validation
- [ ] Regular dependency updates
- [ ] Security headers configured
- [ ] DDoS protection (Cloudflare)

## Scaling Strategy

### Horizontal Scaling

```bash
# Use load balancer (Nginx, AWS ALB)
# Run multiple instances
# Share session/cache (Redis)
```

### Vertical Scaling

- Upgrade server resources
- Optimize database queries
- Add database indexes

### Database Scaling

- Read replicas
- Connection pooling
- Query optimization
- Caching layer

## Maintenance

### Updates

```bash
# Update dependencies
npm update

# Security audit
npm audit
npm audit fix

# Check outdated
npm outdated
```

### Zero-Downtime Deployment

```bash
# Using PM2
pm2 reload tezcart-api

# Using Docker
docker-compose up -d --no-deps --build api
```

---

**Need Help?**
- Check logs: `pm2 logs` or `docker logs`
- Monitor: `pm2 monit`
- Health check: `curl https://api.yourdomain.com/health`
