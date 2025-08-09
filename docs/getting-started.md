# Getting Started with EventSeats

Welcome to EventSeats! This guide will help you set up your own event booking system in just a few minutes.

## 🚀 Quick Setup

### Prerequisites

Before you start, make sure you have:
- **Node.js 18+** ([Download here](https://nodejs.org/))
- **Git** ([Download here](https://git-scm.com/))
- **Supabase account** ([Sign up free](https://supabase.com/))

### Step 1: Get the Code

```bash
# Clone the repository
git clone https://github.com/Hannah-goodridge/eventseats.git
cd show-bookings-system

# Run the setup script
npm run setup
```

The setup script will:
- ✅ Check your Node.js version
- ✅ Install dependencies
- ✅ Create your `.env.local` file

### Step 2: Set Up Your Database

EventSeats uses **Supabase** (a PostgreSQL database) for storing all your data.

#### Create Supabase Project

1. Go to [supabase.com](https://supabase.com/) and sign up
2. Click "New Project"
3. Choose a name (e.g., "my-eventseats")
4. Set a strong database password
5. Wait for the project to be ready (2-3 minutes)

#### Get Your Credentials

1. In your Supabase project dashboard, go to **Settings → API**
2. Copy these values:
   - **Project URL** (starts with `https://...supabase.co`)
   - **anon public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`)

#### Update Your Environment

Edit the `.env.local` file that was created:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here

# Optional: Stripe for payments (work in progress)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**💡 Tip:** For `NEXTAUTH_SECRET`, generate a random string:
```bash
openssl rand -base64 32
```

### Step 3: Set Up Your Database Schema

You have two options:

#### Option A: Use Our SQL Script (Recommended)

1. In Supabase, go to **SQL Editor**
2. Create a new query
3. Copy and paste the contents of `database-setup.sql` from this repository
4. Click "Run"
5. Then copy and paste the contents of `docs/setup-demo-user.sql`
6. Click "Run" again
7. If you have an existing database, also run `scripts/update-venue-fields.sql` to add missing venue fields

#### Option B: Use the TypeScript Seed Script

```bash
npm run setup-demo
```

### Step 4: Start Your Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your EventSeats system!

### Step 5: Sign In

Use these demo credentials to sign in:
- **Email:** `admin@democentre.org`
- **Password:** `demo123`

Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to access the admin panel.

---

## 🎯 What's Next?

### Configure Your Venue

1. **Update Organization Details**
   - Go to Admin → Settings
   - Update your organization name, contact details
   - Set your currency and timezone

2. **Set Up Your Seating**
   - The demo comes with a simple 5×10 seating layout
   - You can modify this or create new layouts
   - Add accessibility information for seats

4. **Add Show Images**
   - Upload your show images to an image hosting service (Imgur, Cloudinary, etc.)
   - Copy the image URL and paste it in the "Image URL" field
   - Leave empty to use a placeholder image
   - Recommended image size: 400x300 pixels or larger

3. **Create Your First Show**
   - Go to Admin → Shows
   - Click "Add Show"
   - Set title, description, prices
   - Add an image URL (optional - leave empty for placeholder)
   - Add performance dates and times

4. **Start Taking Bookings!**
   - Share the booking URL with customers
   - Embed the booking form on your website
   - Monitor bookings in the admin dashboard

### Customize Your Installation

- **Branding:** Update colors, logos, and text
- **Payment Processing:** Set up Stripe for credit card payments (work in progress). See `docs/payments/stripe.md`.
- **Email Notifications:** Configure email settings for confirmations
- **Custom Domain:** Deploy to your own domain

---

## 🛠️ Deployment

When you're ready to go live, you can deploy to:

### Free Options
- **Vercel** (recommended) - One-click deployment
- **Netlify** - Easy static deployment
- **Railway** - Simple full-stack hosting

### Paid Options
- **DigitalOcean App Platform** - $5/month
- **AWS/Google Cloud** - Variable pricing
- **VPS** - Self-managed server

See our [Deployment Guide](deployment/) for detailed instructions.

---

## 🆘 Need Help?

### Common Issues

**"Module not found" errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Database connection errors:**
- Double-check your Supabase credentials in `.env.local`
- Make sure your Supabase project is active
- Check that you've run the database setup SQL

**Can't sign in:**
- Make sure you've run the demo user setup
- Try the password reset SQL: `docs/fix-demo-password.sql`

### Get Support

- 📚 **[GitHub Documentation](https://github.com/Hannah-goodridge/eventseats/tree/main/docs)**
- 💬 **[GitHub Discussions](https://github.com/Hannah-goodridge/eventseats/discussions)**
- 🐛 **[Report Issues](https://github.com/Hannah-goodridge/eventseats/issues)**

### Contributing

EventSeats is open source! We welcome:
- 🐛 Bug reports
- 💡 Feature suggestions
- 🔧 Code contributions
- 📚 Documentation improvements

See our [Contributing Guide](../CONTRIBUTING.md) for details.

---

## 🎉 Success!

You now have your own professional event booking system running!

**What you can do:**
- ✅ Take online bookings 24/7
- ✅ Manage events and performances
- ✅ Track sales and attendance
- ✅ Accept payments securely (Stripe integration in progress)
- ✅ Generate tickets with QR codes
- ✅ Embed booking on your website

**Share your success!**
- ⭐ Star this project on GitHub
- 🐦 Share on social media with #EventSeats
- 💬 Join our community discussions

Welcome to the EventSeats family! 🎭✨
