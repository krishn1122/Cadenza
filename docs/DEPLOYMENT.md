# 🚀 Deployment Guide

This guide covers various deployment options for the Cadenza application.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Local Production Build](#local-production-build)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Database Migration](#database-migration)
- [Monitoring & Logging](#monitoring--logging)

---

## Prerequisites

### System Requirements
- **Node.js**: v18 or higher
- **PostgreSQL**: v13 or higher
- **Memory**: Minimum 2GB RAM
- **Storage**: Minimum 10GB available space

### Production Dependencies
- **Reverse Proxy**: Nginx (recommended)
- **Process Manager**: PM2 (recommended)
- **SSL Certificate**: Let's Encrypt or commercial
- **Domain**: Configured DNS

---

## Environment Setup

### 1. Production Environment Variables

#### Backend (.env)
```env
# Database Configuration
DB_NAME=cadenza_prod
DB_USER=cadenza_user
DB_PASSWORD=secure_production_password
DB_HOST=localhost
DB_PORT=5432

# JWT Configuration
JWT_SECRET=super_secure_jwt_secret_for_production_min_32_chars

# OAuth Configuration
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
LINKEDIN_CLIENT_ID=your_production_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_production_linkedin_client_secret

# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# Session Configuration
SESSION_SECRET=secure_session_secret_for_production
```

#### Frontend (.env.production)
```env
VITE_API_URL=https://yourdomain.com/api
VITE_APP_NAME=Cadenza
NODE_ENV=production
```

### 2. Database Setup

```bash
# Create production database
sudo -u postgres createdb cadenza_prod

# Create dedicated user
sudo -u postgres psql
CREATE USER cadenza_user WITH PASSWORD 'secure_production_password';
GRANT ALL PRIVILEGES ON DATABASE cadenza_prod TO cadenza_user;
\q
```

---

## Local Production Build

### 1. Backend Build

```bash
cd backend

# Install production dependencies
npm ci --only=production

# Build TypeScript
npm run build

# Start production server
npm start
```

### 2. Frontend Build

```bash
cd frontend

# Install dependencies
npm ci

# Build for production
npm run build

# The build files will be in the dist/ directory
```

### 3. Serve Frontend

#### Option A: Using Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # Frontend static files
    location / {
        root /path/to/cadenza/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static images
    location /images {
        proxy_pass http://localhost:5000;
    }
}
```

#### Option B: Using PM2 Ecosystem
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'cadenza-backend',
      script: './dist/app.js',
      cwd: './backend',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};
```

---

## Docker Deployment

### 1. Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

EXPOSE 5000

USER node

CMD ["npm", "start"]
```

### 2. Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 3. Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: cadenza_prod
      POSTGRES_USER: cadenza_user
      POSTGRES_PASSWORD: secure_production_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_NAME=cadenza_prod
      - DB_USER=cadenza_user
      - DB_PASSWORD=secure_production_password
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

### 4. Deploy with Docker

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

---

## Cloud Deployment

### AWS Deployment

#### 1. Using AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB application
eb init cadenza-app

# Create environment
eb create cadenza-prod

# Deploy
eb deploy
```

#### 2. Using AWS ECS

```yaml
# docker-compose.aws.yml
version: '3.8'

services:
  backend:
    image: your-registry/cadenza-backend:latest
    environment:
      - NODE_ENV=production
      - DB_HOST=${RDS_ENDPOINT}
    ports:
      - "5000:5000"

  frontend:
    image: your-registry/cadenza-frontend:latest
    ports:
      - "80:80"
```

### Heroku Deployment

#### 1. Backend (Heroku)

```bash
# Create Heroku app
heroku create cadenza-backend

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_jwt_secret

# Deploy
git push heroku main
```

#### 2. Frontend (Netlify/Vercel)

```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables
VITE_API_URL=https://cadenza-backend.herokuapp.com/api
```

### DigitalOcean Deployment

#### 1. Droplet Setup

```bash
# Create droplet (Ubuntu 20.04)
# SSH into droplet

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Install Nginx
sudo apt-get install nginx

# Install PM2
sudo npm install -g pm2
```

#### 2. Application Deployment

```bash
# Clone repository
git clone https://github.com/yourusername/cadenza.git
cd cadenza

# Setup backend
cd backend
npm ci --only=production
npm run build

# Setup frontend
cd ../frontend
npm ci
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## Database Migration

### 1. Backup Current Database

```bash
# Create backup
pg_dump -U cadenza_user -h localhost cadenza_prod > backup.sql

# Restore backup
psql -U cadenza_user -h localhost cadenza_prod < backup.sql
```

### 2. Migration Scripts

```javascript
// migrations/001-initial-setup.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Migration logic
  },
  down: async (queryInterface, Sequelize) => {
    // Rollback logic
  }
};
```

### 3. Run Migrations

```bash
# Run migrations
npm run migrate

# Rollback migration
npm run migrate:undo
```

---

## Monitoring & Logging

### 1. Application Monitoring

```javascript
// Add to app.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 2. Health Check Endpoint

```javascript
// Add to routes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### 3. PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart cadenza-backend
```

---

## Security Checklist

- [ ] **HTTPS**: SSL certificate installed and configured
- [ ] **Environment Variables**: All secrets in environment variables
- [ ] **Database**: Strong passwords and restricted access
- [ ] **CORS**: Properly configured for production domain
- [ ] **Rate Limiting**: Implemented to prevent abuse
- [ ] **Input Validation**: All user inputs validated
- [ ] **Error Handling**: No sensitive information in error messages
- [ ] **Updates**: All dependencies updated to latest secure versions

---

## Performance Optimization

### 1. Frontend Optimization

- **Code Splitting**: Implement lazy loading
- **Asset Optimization**: Compress images and assets
- **CDN**: Use CDN for static assets
- **Caching**: Implement proper caching headers

### 2. Backend Optimization

- **Database Indexing**: Add appropriate indexes
- **Connection Pooling**: Configure database connection pool
- **Caching**: Implement Redis for caching
- **Load Balancing**: Use multiple instances with load balancer

### 3. Database Optimization

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_companies_category ON companies(category);
CREATE INDEX idx_companies_location ON companies(location);
CREATE INDEX idx_people_category ON people(category);
CREATE INDEX idx_blogs_published ON blogs(published);
```

---

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql
   
   # Check connection
   psql -U cadenza_user -h localhost -d cadenza_prod
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port
   lsof -i :5000
   
   # Kill process
   kill -9 <PID>
   ```

3. **Environment Variables Not Loading**
   ```bash
   # Check if .env file exists
   ls -la .env
   
   # Verify environment variables
   printenv | grep DB_
   ```

### Logs Location

- **Application Logs**: `./logs/`
- **Nginx Logs**: `/var/log/nginx/`
- **PostgreSQL Logs**: `/var/log/postgresql/`
- **PM2 Logs**: `~/.pm2/logs/`

---

## Maintenance

### Regular Tasks

- **Database Backups**: Daily automated backups
- **Log Rotation**: Configure log rotation
- **Security Updates**: Regular dependency updates
- **Performance Monitoring**: Monitor application metrics
- **SSL Certificate Renewal**: Automated renewal setup

### Update Process

1. **Backup Database**
2. **Test in Staging**
3. **Deploy to Production**
4. **Verify Deployment**
5. **Monitor for Issues**

---

For additional support, please refer to the [main documentation](../README.md) or open an issue on GitHub.
