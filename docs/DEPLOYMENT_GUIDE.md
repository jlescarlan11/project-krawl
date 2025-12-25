# Krawl Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Krawl application to production. The deployment uses Oracle Cloud Infrastructure (OCI) for the backend and Vercel for the frontend, with Aiven PostgreSQL as the managed database.

**Target Architecture:**
- **Frontend:** Vercel (Next.js 16.0.3)
- **Backend:** Oracle Cloud Infrastructure Always Free Tier (Spring Boot 3.5.7)
- **Database:** Aiven PostgreSQL with PostGIS
- **CDN/Images:** Cloudinary
- **Email:** Brevo
- **Monitoring:** Sentry

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Backend Deployment (OCI)](#backend-deployment-oci)
5. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
6. [DNS Configuration](#dns-configuration)
7. [SSL/TLS Setup](#ssltls-setup)
8. [Monitoring and Logging](#monitoring-and-logging)
9. [Backup and Disaster Recovery](#backup-and-disaster-recovery)
10. [Deployment Checklist](#deployment-checklist)
11. [Rollback Procedures](#rollback-procedures)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts

- ✅ Oracle Cloud Infrastructure account (Always Free Tier)
- ✅ Vercel account
- ✅ Aiven account (PostgreSQL service created)
- ✅ Cloudinary account
- ✅ Brevo account
- ✅ Sentry account (optional but recommended)
- ✅ Domain registrar account (if using custom domain)

### Required Tools

- Git
- Maven 3.9.x
- Node.js 20.x LTS
- OCI CLI
- Vercel CLI (optional)

---

## Environment Configuration

### Production Environment Variables

#### Backend (.env for OCI)

```bash
# Database Configuration (Aiven PostgreSQL)
DB_HOST=your-aiven-host.aivencloud.com
DB_PORT=25060
DB_NAME=defaultdb
DB_USERNAME=avnadmin
DB_PASSWORD=your-secure-password
DB_SSL_MODE=require

# JWT Configuration
JWT_SECRET=your-production-jwt-secret-minimum-32-characters
JWT_EXPIRATION_MS=3600000
REFRESH_TOKEN_EXPIRATION_MS=604800000

# Google OAuth
GOOGLE_CLIENT_ID=your-production-google-client-id

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Service (Brevo)
BREVO_API_KEY=your-production-brevo-api-key
EMAIL_FROM_ADDRESS=noreply@krawl.app
EMAIL_FROM_NAME=Krawl

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://krawl.app,https://www.krawl.app

# Server Configuration
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

#### Frontend (.env.production for Vercel)

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=https://krawl.app
NEXTAUTH_SECRET=your-production-nextauth-secret-minimum-32-characters

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret

# Backend API
NEXT_PUBLIC_API_URL=https://api.krawl.app

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your-production-mapbox-token

# Sentry
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-auth-token
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

---

## Database Setup

### 1. Aiven PostgreSQL Production Setup

**Access Aiven Console:**
1. Go to [console.aiven.io](https://console.aiven.io/)
2. Navigate to your PostgreSQL service
3. Note connection details

**Enable PostGIS:**
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

**Create Production Database:**
```sql
CREATE DATABASE krawl_production;
```

### 2. Run Migrations

Migrations run automatically on application startup via Flyway.

**Verify Migrations:**
```bash
# Connect to database
psql -h your-aiven-host.aivencloud.com -p 25060 -U avnadmin -d krawl_production

# Check migration status
SELECT * FROM flyway_schema_history ORDER BY installed_rank;
```

### 3. Database Backup Configuration

**Automated Backups:**
- Aiven provides automated daily backups
- Retention: 7 days (free tier)
- Backups stored in cloud storage

**Manual Backup:**
```bash
pg_dump -h your-aiven-host.aivencloud.com -p 25060 -U avnadmin -d krawl_production -F c -f krawl_backup_$(date +%Y%m%d).dump
```

---

## Backend Deployment (OCI)

### 1. Prepare Application

**Build Application:**
```bash
cd backend
./mvnw clean package -DskipTests
```

**Verify JAR:**
```bash
ls -lh target/krawl-backend-0.0.1-SNAPSHOT.jar
```

### 2. Setup OCI Compute Instance

**Instance Specifications (Always Free Tier):**
- Shape: VM.Standard.E2.1.Micro
- OS: Oracle Linux 8
- OCPUs: 1
- Memory: 1GB
- Storage: 50GB

**Create Instance:**
1. Log in to OCI Console
2. Navigate to Compute > Instances
3. Click "Create Instance"
4. Select specifications above
5. Configure VCN and subnet
6. Add SSH key
7. Create instance

### 3. Configure Firewall Rules

**Security List Rules:**
```
Ingress Rules:
- Source: 0.0.0.0/0, Protocol: TCP, Port: 22 (SSH)
- Source: 0.0.0.0/0, Protocol: TCP, Port: 8080 (Application)
- Source: 0.0.0.0/0, Protocol: TCP, Port: 443 (HTTPS via reverse proxy)
```

### 4. Install Dependencies on OCI Instance

```bash
# SSH into instance
ssh -i your-key.pem opc@<instance-public-ip>

# Install Java 25
sudo yum install -y java-25-openjdk

# Verify installation
java --version

# Install nginx (reverse proxy)
sudo yum install -y nginx

# Start and enable nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 5. Deploy Application

**Upload JAR:**
```bash
# From local machine
scp -i your-key.pem backend/target/krawl-backend-0.0.1-SNAPSHOT.jar opc@<instance-ip>:/home/opc/
```

**Create Systemd Service:**
```bash
sudo vi /etc/systemd/system/krawl.service
```

```ini
[Unit]
Description=Krawl Backend Application
After=network.target

[Service]
Type=simple
User=opc
WorkingDirectory=/home/opc
ExecStart=/usr/bin/java -jar /home/opc/krawl-backend-0.0.1-SNAPSHOT.jar
EnvironmentFile=/home/opc/.env
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Start Service:**
```bash
sudo systemctl daemon-reload
sudo systemctl start krawl
sudo systemctl enable krawl
sudo systemctl status krawl
```

### 6. Configure Nginx Reverse Proxy

```bash
sudo vi /etc/nginx/conf.d/krawl.conf
```

```nginx
server {
    listen 80;
    server_name api.krawl.app;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Test and Reload:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## Frontend Deployment (Vercel)

### 1. Prepare for Deployment

**Install Vercel CLI:**
```bash
npm install -g vercel
```

**Login to Vercel:**
```bash
vercel login
```

### 2. Configure Project

**vercel.json:**
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.krawl.app",
    "NEXT_PUBLIC_MAPBOX_TOKEN": "@mapbox-token"
  }
}
```

### 3. Deploy to Vercel

**From Local Machine:**
```bash
cd frontend
vercel --prod
```

**From GitHub (Recommended):**
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Enable automatic deployments

### 4. Configure Environment Variables in Vercel

**Vercel Dashboard:**
1. Go to project settings
2. Navigate to "Environment Variables"
3. Add all production environment variables
4. Set scope to "Production"

### 5. Configure Custom Domain

**Vercel Dashboard:**
1. Go to project settings
2. Navigate to "Domains"
3. Add custom domain: `krawl.app` and `www.krawl.app`
4. Follow DNS configuration instructions

---

## DNS Configuration

### Configure DNS Records

**Domain Registrar:**
```
Type: A
Name: @
Value: <OCI-Instance-IP>
TTL: 3600

Type: CNAME
Name: api
Value: <OCI-Instance-IP> or domain
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Verify DNS:**
```bash
dig krawl.app
dig api.krawl.app
dig www.krawl.app
```

---

## SSL/TLS Setup

### Backend SSL (Let's Encrypt)

```bash
# Install certbot
sudo yum install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.krawl.app

# Verify auto-renewal
sudo certbot renew --dry-run
```

**Updated Nginx Config:**
```nginx
server {
    listen 443 ssl http2;
    server_name api.krawl.app;

    ssl_certificate /etc/letsencrypt/live/api.krawl.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.krawl.app/privkey.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name api.krawl.app;
    return 301 https://$server_name$request_uri;
}
```

### Frontend SSL (Vercel)

SSL automatically configured by Vercel for all domains.

---

## Monitoring and Logging

### Application Logs

**Backend Logs:**
```bash
# View logs
sudo journalctl -u krawl -f

# Last 100 lines
sudo journalctl -u krawl -n 100

# Logs for specific date
sudo journalctl -u krawl --since "2025-01-15"
```

### Sentry Integration

**Already configured in code**
- Errors automatically sent to Sentry
- Performance monitoring enabled
- Release tracking configured

### Health Checks

**Backend Health:**
```bash
curl https://api.krawl.app/actuator/health
```

**Frontend Health:**
```bash
curl https://krawl.app/api/health
```

---

## Backup and Disaster Recovery

### Database Backups

**Automated:** Aiven daily backups (7-day retention)

**Manual Backup Script:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/opc/backups"
mkdir -p $BACKUP_DIR

pg_dump -h your-aiven-host.aivencloud.com -p 25060 -U avnadmin -d krawl_production \
  -F c -f $BACKUP_DIR/krawl_backup_$DATE.dump

# Keep only last 30 days of backups
find $BACKUP_DIR -name "krawl_backup_*.dump" -mtime +30 -delete
```

**Restore from Backup:**
```bash
pg_restore -h your-aiven-host.aivencloud.com -p 25060 -U avnadmin -d krawl_production \
  -c krawl_backup_20250115.dump
```

### Application Backups

**Code:** Git repository (GitHub)
**Uploaded Images:** Cloudinary (persistent storage)
**Configuration:** Environment variables documented

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] SSL certificates ready
- [ ] DNS records configured
- [ ] Monitoring setup complete
- [ ] Backup system verified

### Deployment Steps

- [ ] Build application
- [ ] Run database migrations
- [ ] Deploy backend to OCI
- [ ] Deploy frontend to Vercel
- [ ] Verify health checks
- [ ] Test critical flows
- [ ] Monitor error rates
- [ ] Update documentation

### Post-Deployment

- [ ] Smoke tests passed
- [ ] Performance metrics normal
- [ ] No critical errors in Sentry
- [ ] Database queries optimized
- [ ] Cache working correctly
- [ ] SSL certificates valid
- [ ] Backups running

---

## Rollback Procedures

### Backend Rollback

```bash
# SSH to OCI instance
ssh -i your-key.pem opc@<instance-ip>

# Stop service
sudo systemctl stop krawl

# Replace JAR with previous version
mv krawl-backend-previous.jar krawl-backend-0.0.1-SNAPSHOT.jar

# Start service
sudo systemctl start krawl

# Verify
sudo systemctl status krawl
```

### Frontend Rollback

**Vercel Dashboard:**
1. Go to deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

**Or via CLI:**
```bash
vercel rollback
```

### Database Rollback

```sql
-- Rollback last migration
DELETE FROM flyway_schema_history WHERE installed_rank = (
  SELECT MAX(installed_rank) FROM flyway_schema_history
);

-- Then restore from backup if needed
```

---

## Troubleshooting

### Backend Not Starting

```bash
# Check logs
sudo journalctl -u krawl -n 100

# Common issues:
# 1. Database connection failed - verify DB credentials
# 2. Port already in use - check for other processes
# 3. Java version mismatch - verify Java 25 installed
```

### Frontend Build Errors

```bash
# Check Vercel logs
vercel logs

# Common issues:
# 1. Environment variables missing
# 2. Build command incorrect
# 3. Node version mismatch
```

### Database Connection Issues

```bash
# Test connection
psql -h your-aiven-host.aivencloud.com -p 25060 -U avnadmin -d krawl_production

# Check firewall
telnet your-aiven-host.aivencloud.com 25060

# Verify SSL requirement
```

### SSL Certificate Issues

```bash
# Renew certificate
sudo certbot renew

# Check certificate expiry
sudo certbot certificates

# Test SSL
curl -vI https://api.krawl.app
```

---

## Maintenance

### Regular Maintenance Tasks

**Daily:**
- Monitor error rates in Sentry
- Check application logs
- Verify health checks

**Weekly:**
- Review performance metrics
- Check disk space
- Review database slow queries

**Monthly:**
- Update dependencies
- Review and archive old logs
- Test backup restoration
- Security patches

---

## Support

For deployment issues:
1. Check this guide
2. Review application logs
3. Check Sentry for errors
4. Contact DevOps team

---

**Last Updated:** December 23, 2025
**Version:** 1.0.0
**Next Review:** After first production deployment
