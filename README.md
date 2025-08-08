# EventSeats - Open Source Event Booking System

🎪 **A free, open-source seat booking system designed for small venues, theatre groups, and community events.**

Built for organizations with small budgets but big dreams. Professional booking experience without enterprise costs.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)

🌐 **Live Demo:** [eventseats.hannahgoodridge.dev](https://eventseats.hannahgoodridge.dev)
📖 **Documentation:** [GitHub Docs](https://github.com/Hannah-goodridge/eventseats/tree/main/docs)
💬 **Built by:** [Hannah Goodridge](https://hannahgoodridge.dev)

---

## 🚀 Quick Start

### Option 1: One-Click Deploy (Recommended for Testing)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Hannah-goodridge/eventseats)

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/Hannah-goodridge/eventseats.git
cd show-bookings-system

# Install dependencies
npm install

# Copy environment variables
cp env.example .env.local

# Set up the database
npm run setup-db

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your booking system!

---

## ✨ Features

- 🎫 **Interactive Seat Selection**: Visual seat map with real-time availability
- 🎭 **Multiple Ticket Types**: Adult, child, and concession pricing
- 📱 **Mobile Responsive**: Works perfectly on all devices
- 🔒 **Secure**: Built with security best practices
- 🌐 **Embeddable**: Simple iframe embedding for any website
- 📊 **Admin Dashboard**: Manage shows, performances, and bookings
- 🎪 **Multi-Venue Support**: Perfect for theatre groups and community centres
- 📧 **Email Notifications**: Automated booking confirmations
- 🏷️ **QR Code Tickets**: Digital tickets with QR codes
- 💳 **Payment Processing**: Stripe integration (work in progress)
- 🔓 **Open Source**: MIT licensed, self-host for free

---

## 🏗️ Full Setup Guide

### Prerequisites

- **Node.js** 18+ ([Download here](https://nodejs.org/))
- **PostgreSQL** or **Supabase** account ([Get free account](https://supabase.com/))
- **Stripe** account for payments - **Optional** (work in progress) ([Get account](https://stripe.com/))

### Step 1: Clone and Install

```bash
git clone https://github.com/Hannah-goodridge/eventseats.git
cd show-bookings-system
npm install
```

### Step 2: Environment Setup

Copy the example environment file:
```bash
cp env.example .env.local
```

Edit `.env.local` with your values:
```env
# Database (Supabase recommended)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Stripe (optional for payments - work in progress)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Step 3: Database Setup

**Option A: Supabase (Recommended)**
1. Create account at [supabase.com](https://supabase.com/)
2. Create new project
3. Run the setup script:
```bash
npm run setup-supabase
```

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL locally
# Create database
createdb eventseats

# Run setup
npm run setup-db
```

### Step 4: Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

### Step 5: Initial Setup

1. Visit `http://localhost:3000/admin/login`
2. Create your first admin account
3. Add your venue and seating layout
4. Create your first show
5. Start selling tickets! 🎉

---

## 📖 Documentation

### Getting Started
- **[Quick Start Guide](docs/getting-started.md)** - Set up EventSeats in minutes
- **[Embedding Guide](docs/embedding.md)** - Add booking to your website
- **[Simple Embedding](docs/simple-embedding.md)** - Quick embed setup

### Deployment
- **[Vercel Deployment](docs/deployment/vercel.md)** - One-click deployment
- **[Railway Deployment](docs/deployment/railway.md)** - Simple hosting
- **[Self-Hosted Setup](docs/deployment/self-hosted.md)** - VPS deployment
- **[Squarespace Integration](docs/deployment/squarespace-deployment.md)** - Website integration

### Examples & Setup
- **[Venue Setup Examples](docs/examples/venue-setups.md)** - Real venue configurations
- **[Embed Examples](docs/examples/embed-examples.html)** - HTML embedding examples
- **[Demo User Setup](docs/setup-demo-user.sql)** - Database setup script

### For Developers
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute
- **[API Documentation](docs/api.md)** - REST API reference (coming soon)
- **[Database Schema](docs/database.md)** - Database structure (coming soon)

---

## 🚀 Deployment Options

### Hosted Services

| Service | Cost | Difficulty | Best For |
|---------|------|------------|----------|
| **Vercel** | Free tier available | Easy | Quick testing |
| **Railway** | $5/month | Easy | Production ready |
| **DigitalOcean App Platform** | $5/month | Medium | Scalable apps |
| **AWS/GCP** | Variable | Hard | Enterprise |

### Self-Hosted

- **VPS** (DigitalOcean, Linode, Vultr)
- **Docker** deployment included
- **PM2** process management
- **Nginx** reverse proxy setup

See our **[Deployment Guide](docs/deployment/)** for detailed instructions.

---

## 🤝 Contributing

We love contributions! EventSeats is built by the community, for the community.

### Quick Contributing Guide

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes
4. **Test** thoroughly: `npm test`
5. **Commit** with clear message: `git commit -m 'Add amazing feature'`
6. **Push** to branch: `git push origin feature/amazing-feature`
7. **Open** a Pull Request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/show-bookings-system.git
cd show-bookings-system

# Add upstream remote
git remote add upstream https://github.com/Hannah-goodridge/eventseats.git

# Install dependencies
npm install

# Run tests
npm test

# Start development
npm run dev
```

### What We Need Help With

- 🌍 **Translations** - Make EventSeats available in more languages
- 🎨 **Themes** - Create beautiful themes for different types of events
- 🔌 **Integrations** - Payment gateways, email services, CRM systems
- 📱 **Mobile App** - React Native companion app
- 🧪 **Testing** - More comprehensive test coverage
- 📚 **Documentation** - Improve guides and tutorials

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for detailed guidelines.

---

## 💬 Community & Support

### Get Help
- 📚 **[GitHub Documentation](https://github.com/Hannah-goodridge/eventseats/tree/main/docs)**
- 💬 **[GitHub Discussions](https://github.com/Hannah-goodridge/eventseats/discussions)**
- 🐛 **[Issue Tracker](https://github.com/Hannah-goodridge/eventseats/issues)**

### Show Your Support
- ⭐ **Star this repository** if it helps you!
- 🐦 **Share on social media** with #EventSeats
- 💝 **[Sponsor the project](https://github.com/sponsors/hannahgoodridge)**

---

## 📜 License

EventSeats is **MIT licensed**. You can:
- ✅ Use commercially
- ✅ Modify freely
- ✅ Distribute
- ✅ Sub-license
- ✅ Use privately

See **[LICENSE](LICENSE)** for full details.

---

## 🙏 Acknowledgements

Built with amazing open-source tools:
- **[Next.js](https://nextjs.org/)** - React framework
- **[Supabase](https://supabase.com/)** - Database and auth
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

Special thanks to all **[contributors](https://github.com/Hannah-goodridge/eventseats/graphs/contributors)** who make EventSeats better! 🎭

---

<div align="center">

**Made with ❤️ by [Hannah Goodridge](https://hannahgoodridge.dev)**

[⭐ Star on GitHub](https://github.com/Hannah-goodridge/eventseats) • [🌐 Live Demo](https://eventseats.hannahgoodridge.dev) • [📖 GitHub Docs](https://github.com/Hannah-goodridge/eventseats/tree/main/docs)

</div>
- 📧 **Email Notifications**: Automated booking confirmations
- 🎨 **Customizable**: Venue layouts, branding, and pricing
- 📱 **Mobile Responsive**: Works on all devices
- 🔒 **Admin Dashboard**: Manage shows, bookings, and check-ins
- 📊 **Analytics**: Track sales and popular shows

## Quick Start

### One-Click Deploy Options

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hannah-goodridge/eventseats)

[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/template/xxx)

### Manual Setup

#### Option 1: Supabase Setup (Recommended)

**Easiest and most reliable setup with built-in auth and real-time features:**

1. **Clone the repository**
   ```bash
   git clone https://github.com/hannah-goodridge/eventseats.git
   cd show-bookings-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm install @supabase/supabase-js
   ```

3. **Create Supabase project** at [supabase.com](https://supabase.com)

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase URL and anon key (see [Supabase Setup Guide](./docs/setup-supabase.md))

5. **Create database tables** using Supabase SQL Editor

6. **Run the development server**
   ```bash
   npm run dev
   ```

#### Option 2: Traditional Database Setup

**For those who prefer direct PostgreSQL connections:**

1. **Clone and install** (same as above)
2. **Set up database** (PostgreSQL/MySQL)
3. **Configure environment variables**
4. **Run migrations**
   ```bash
   npm run setup-demo
   ```
5. **Start development server**

## Documentation

- 🚀 **[Supabase Setup Guide (Recommended)](./docs/setup-supabase.md)**
- 📚 [Traditional Setup Guide](./docs/setup.md)
- ⚙️ [Environment Configuration Examples](./docs/examples/environment-configs.md)
- 🚀 **Deployment Guides:**
  - [Deploy to Vercel](./docs/deployment/vercel.md)
  - [Deploy to Railway](./docs/deployment/railway.md)
  - [Self-Hosted Deployment](./docs/deployment/self-hosted.md)
- 🎭 [Venue Setup Examples](./docs/examples/venue-setups.md)
- 🔧 [API Documentation](./docs/api.md)

## Cost Breakdown

### Minimum Running Costs
- **Domain**: £10-15/year
- **Hosting**: Free (Vercel/Netlify)
- **Database**: Free tier (Supabase/PlanetScale)
- **Payment Processing**: 2.9% + 30p per transaction (Stripe - work in progress)
- **Email**: Free tier (most providers)

**Total**: ~£1-2/month + payment processing fees (when Stripe is ready)

## Community

- 🐛 [Report Issues](https://github.com/hannah-goodridge/eventseats/issues)
- 💬 [Discussions](https://github.com/hannah-goodridge/eventseats/discussions)
- 📖 [Documentation](./docs/)
- ❤️ [Contributing](./CONTRIBUTING.md)

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Support the Project

If this project helps your drama group, consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs or suggesting features
- 💝 [Sponsoring development](https://github.com/sponsors/yourusername)
- 🗣️ Sharing with other drama groups

---

**Built with ❤️ for the theatre community**