# Deploy to Railway

Deploy EventSeats software to Railway with their integrated PostgreSQL database.

## Prerequisites

- A Railway account (free tier available)
- Your repository on GitHub

## Quick Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/xxx)

## Manual Deployment

### 1. Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your show-bookings-system repository

### 2. Add PostgreSQL Database

1. In your Railway project dashboard
2. Click "New Service"
3. Select "Database" > "PostgreSQL"
4. Railway will create a database and provide connection details

### 3. Configure Environment Variables

In your Railway project settings, add these environment variables:

```env
# Database (automatically provided by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://your-app.up.railway.app"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
FROM_EMAIL="noreply@yourvenue.com"

# Venue Details
VENUE_NAME="Your Theatre Name"
VENUE_EMAIL="info@yourvenue.com"
VENUE_PHONE="+44 1234 567890"
VENUE_ADDRESS="123 Theatre Street, Your City, YC1 2AB"

# Application
APP_URL="https://your-app.up.railway.app"
ADMIN_EMAIL="admin@yourvenue.com"
```

### 4. Set Up Database Schema

Railway will automatically run your build process. To set up the database:

1. Go to your Railway project
2. Open the database service
3. Use the "Query" tab or connect via the provided URL
4. Or run locally with the Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway link

# Run database commands
railway run npm run setup-demo
```

### 5. Configure Stripe Webhooks

1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://your-app.up.railway.app/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy webhook secret to Railway environment variables

### 6. Custom Domain (Optional)

1. In Railway project settings, go to "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. Set `NEXTAUTH_URL` to your public Railway URL. `APP_URL` is optional and used only as a fallback.

## Railway Features

### Database Management
- Built-in PostgreSQL with connection pooling
- Automatic backups
- Database browser in dashboard
- Direct psql access

### Monitoring
- Built-in metrics and logs
- Performance monitoring
- Deployment history
- Resource usage tracking

### Scaling
- Automatic scaling based on traffic
- Resource limit configuration
- Multiple deployment regions

## CLI Deployment

You can also deploy using the Railway CLI:

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Initialize in your project
railway init

# Deploy
railway up
```

## Environment Management

### Development vs Production
Use Railway's environment feature:

```bash
# Create staging environment
railway environment create staging

# Deploy to specific environment
railway up --environment production
```

### Secret Management
Store sensitive data securely:

```bash
# Add secrets via CLI
railway variables set STRIPE_SECRET_KEY=sk_live_...
railway variables set NEXTAUTH_SECRET=your-secret
```

## Database Backup

Railway provides automatic backups, but you can also:

```bash
# Manual backup
railway run pg_dump $DATABASE_URL > backup.sql

# Restore backup
railway run psql $DATABASE_URL < backup.sql
```

## Troubleshooting

**"Build failed"**
- Check your package.json scripts
- Verify all dependencies are in package.json
- Check Railway build logs

**"Database connection failed"**
- Verify DATABASE_URL variable is set
- Check database service is running
- Try redeploying database service

**"App not accessible"**
- Check deployment logs
- Verify environment variables
- Ensure app is listening on correct port

**"Webhooks not working"**
- Verify webhook URL in Stripe
- Check webhook secret matches
- Monitor Railway logs for webhook requests

## Cost Optimization

### Free Tier Limits
- $5 credit per month
- Usage-based billing
- Shared CPU and memory

### Optimization Tips
- Monitor resource usage in dashboard
- Optimize database queries
- Use appropriate instance sizes
- Set up alerts for usage limits

## Monitoring and Maintenance

### Built-in Monitoring
- Application metrics
- Database performance
- Deployment history
- Error tracking

### External Monitoring
Consider adding:
- Uptime monitoring (UptimeRobot)
- Error tracking (Sentry)
- Performance monitoring (LogRocket)

### Regular Maintenance
- Monitor database size
- Review application logs
- Update dependencies regularly
- Backup important data

## Migration from Other Platforms

### From Vercel/Netlify
1. Export environment variables
2. Import repository to Railway
3. Set up database connection
4. Update DNS records

### From Heroku
1. Export database if needed
2. Update environment variables
3. Update any Heroku-specific configurations
4. Test deployment thoroughly
