# Deploy EventSeats to Vercel

Deploy your EventSeats booking system to Vercel with Supabase database.

## Prerequisites

- A Vercel account (free)
- A database provider (Supabase, Railway, or Neon - all have free tiers)
- Your environment variables ready

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/show-bookings-system)

## Manual Deployment

### 1. Fork/Clone the Repository

```bash
git clone https://github.com/yourusername/show-bookings-system.git
cd show-bookings-system
```

### 2. Set Up Database

#### Option A: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (it looks like: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`)

#### Option B: Railway
1. Go to [railway.app](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the DATABASE_URL from the Connect tab

#### Option C: Neon
1. Go to [neon.tech](https://neon.tech)
2. Create a new database
3. Copy the connection string

### 3. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-app.vercel.app"
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
# ... other variables from .env.example
```

### 4. Set Up Database Schema

After deployment, run migrations:

```bash
# Clone your repo locally if you haven't already
npm install
npm run setup-demo
```

### 5. Configure Stripe Webhooks

1. Go to your Stripe Dashboard > Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy the webhook secret to your Vercel environment variables

### 6. Test Your Deployment

1. Visit your Vercel URL
2. Create a test booking
3. Check admin dashboard at `/admin`

## Environment Variables

Copy all variables from `.env.example` and update with your production values:

- **DATABASE_URL**: Your PostgreSQL connection string
- **NEXTAUTH_URL**: Your Vercel deployment URL
- **STRIPE_***: Your live Stripe API keys (for production)
- **SMTP_***: Your production email configuration
- **VENUE_***: Your venue details

## Automatic Deployments

Vercel automatically redeploys when you push to your main branch. To deploy:

```bash
git add .
git commit -m "Update booking system"
git push origin main
```

## Custom Domain

1. In Vercel dashboard, go to your project
2. Go to Settings > Domains
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` environment variable

## Performance Tips

- Enable Vercel Analytics in your dashboard
- Consider Vercel Pro for better performance
- Use Edge Middleware for faster auth checks
- Enable Image Optimization for show posters

## Troubleshooting

**"Database connection failed"**
- Verify DATABASE_URL is correct
- Check database is publicly accessible
- Ensure SSL is configured correctly

**"NEXTAUTH_URL mismatch"**
- Update NEXTAUTH_URL to match your domain
- Redeploy after changing environment variables

**"Stripe webhooks failing"**
- Verify webhook URL in Stripe dashboard
- Check webhook secret matches environment variable
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

## Monitoring

- Monitor deployments in Vercel dashboard
- Set up error tracking (Sentry recommended)
- Monitor database performance in your provider's dashboard
- Track Stripe payments in Stripe dashboard

## Scaling

Vercel scales automatically, but consider:
- Database connection limits
- Stripe rate limits
- Email sending limits
- File storage needs (add AWS S3 if needed)
