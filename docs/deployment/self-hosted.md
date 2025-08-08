# Self-Hosted Deployment

Deploy your Show Bookings System on your own server or VPS.

## Prerequisites

- A VPS or dedicated server (Ubuntu 20.04+ recommended)
- Domain name pointing to your server
- SSL certificate (Let's Encrypt recommended)
- Basic Linux administration knowledge

## Server Requirements

### Minimum Specifications
- **CPU**: 1 vCPU
- **RAM**: 1GB
- **Storage**: 20GB SSD
- **Network**: 1TB bandwidth/month

### Recommended Specifications
- **CPU**: 2 vCPU
- **RAM**: 2GB
- **Storage**: 40GB SSD
- **Network**: Unlimited bandwidth

## Option 1: Docker Deployment (Recommended)

### 1. Install Docker

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Create Docker Compose File

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/show_bookings
      - NEXTAUTH_URL=https://yourdomain.com
      - NEXTAUTH_SECRET=your-secret-key-here
      # Add other environment variables
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=show_bookings
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

### 3. Create Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY scripts ./scripts/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### 4. Configure Nginx

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name yourdomain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### 5. Deploy

```bash
# Clone your repository
git clone https://github.com/yourusername/show-bookings-system.git
cd show-bookings-system

# Create environment file
cp .env.example .env
# Edit .env with your production values

# Start services
docker-compose up -d

# Run database migrations
docker-compose exec app npm run setup-demo
```

## Option 2: Manual Installation

### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. Set Up Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE show_bookings;
CREATE USER booking_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE show_bookings TO booking_user;
\q
```

### 3. Deploy Application

```bash
# Clone repository
git clone https://github.com/yourusername/show-bookings-system.git
cd show-bookings-system

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your production values

# Build application
npm run build

# Run database migrations
npm run setup-demo

# Start with PM2
pm2 start npm --name "booking-system" -- start
pm2 save
pm2 startup
```

### 4. Configure Nginx

Create `/etc/nginx/sites-available/booking-system`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/booking-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL Certificate Setup

### Using Certbot (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Environment Variables

Create `.env` file with production values:

```env
# Database
DATABASE_URL="postgresql://booking_user:secure_password@localhost:5432/show_bookings"

# Authentication
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Stripe (use live keys for production)
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
FROM_EMAIL="noreply@yourdomain.com"

# Venue Details
VENUE_NAME="Your Theatre Name"
VENUE_EMAIL="info@yourdomain.com"
VENUE_PHONE="+44 1234 567890"
VENUE_ADDRESS="123 Theatre Street, Your City, YC1 2AB"

# Application
APP_URL="https://yourdomain.com"
ADMIN_EMAIL="admin@yourdomain.com"
```

## Monitoring and Maintenance

### System Monitoring

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# Check application status
pm2 status
pm2 logs booking-system

# Check database
sudo -u postgres psql show_bookings -c "\dt"
```

### Backup Strategy

Create backup script `/home/user/backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/user/backups"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
sudo -u postgres pg_dump show_bookings > $BACKUP_DIR/db_$DATE.sql

# Application backup
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /path/to/show-bookings-system

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

Add to crontab:
```bash
crontab -e
# Add: 0 2 * * * /home/user/backup.sh
```

### Security Hardening

```bash
# Update firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Fail2ban for SSH protection
sudo apt install fail2ban -y

# Regular updates
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure unattended-upgrades
```

## Troubleshooting

### Application Issues
```bash
# Check application logs
pm2 logs booking-system

# Restart application
pm2 restart booking-system

# Check process status
pm2 status
```

### Database Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Nginx Issues
```bash
# Check configuration
sudo nginx -t

# Check status
sudo systemctl status nginx

# View logs
sudo tail -f /var/log/nginx/error.log
```

## Scaling Considerations

### Vertical Scaling
- Upgrade server resources (CPU, RAM, storage)
- Optimize database configuration
- Enable connection pooling

### Horizontal Scaling
- Load balancer setup
- Database clustering
- CDN for static assets
- Redis for session storage

### Performance Optimization
- Enable gzip compression
- Configure caching headers
- Optimize database queries
- Monitor resource usage
