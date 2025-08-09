# Deploying EventSeats to Work with Squarespace

This guide shows you how to deploy EventSeats and integrate it with your existing Squarespace website.

## 🎯 Deployment Strategy

Since Squarespace doesn't support full-stack applications, we'll deploy EventSeats separately and integrate it with your Squarespace site.

### Option 1: Subdomain Approach (Recommended)
- Deploy EventSeats to: `eventseats.yourdomain.com`
- Keep main site on: `yourdomain.com` (Squarespace)
- Benefits: Clean separation, professional appearance

### Option 2: Separate Domain
- Deploy EventSeats to: `eventseats.io` (or similar)
- Keep main site on: `yourdomain.com` (Squarespace)
- Benefits: Independent branding, easier management

## 🚀 Step-by-Step Deployment

### Phase 1: Deploy EventSeats to Vercel

1. **Prepare Your Repository**
   ```bash
   git add .
   git commit -m "Production ready EventSeats"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Deploy!

3. **Set Environment Variables in Vercel**
   ```env
   # Database
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # Authentication
   NEXTAUTH_URL=https://eventseats.yourdomain.com
   NEXTAUTH_SECRET=your-long-random-secret-here

   # Payments (Optional)
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

### Phase 2: Set Up Custom Domain

1. **In Vercel Dashboard**
   - Go to your project → Settings → Domains
   - Add domain: `eventseats.yourdomain.com`
   - Copy the provided DNS records

2. **In Your Domain Provider (e.g., GoDaddy, Namecheap)**
   - Add CNAME record:
     ```
     Name: eventseats
     Value: cname.vercel-dns.com
     ```
   - Wait for DNS propagation (up to 24 hours)

3. **Verify SSL Certificate**
   - Vercel automatically provisions SSL
   - Test: `https://eventseats.yourdomain.com`

### Phase 3: Database Setup

1. **Production Supabase Project**
   - Create new Supabase project for production
   - Name it: "EventSeats Production"
   - Choose a region close to your users

2. **Set Up Database Schema**
   - In Supabase SQL Editor, run: `database-setup.sql`
   - Then run: `docs/setup-demo-user.sql` (optional)

3. **Configure Security**
   - Enable Row Level Security (RLS)
   - Set up proper API policies
   - Configure CORS for your domain

### Phase 4: Integration with Squarespace

#### Method 1: Embed Widget (Easiest)

Add this to any Squarespace page:

```html
<!-- Code Injection or Code Block -->
<div style="margin: 20px 0;">
    <h3>Book Your Tickets</h3>
    <iframe
        src="https://eventseats.yourdomain.com/embed/SHOW_ID/PERFORMANCE_ID"
        width="100%"
        height="600"
        frameborder="0"
        style="border: 1px solid #ddd; border-radius: 8px;">
    </iframe>
</div>
```

#### Method 2: Direct Links

Add buttons/links in Squarespace that open EventSeats:

```html
<a href="https://eventseats.yourdomain.com/book/show-id/performance-id"
   class="sqs-block-button-element"
   target="_blank">
   Book Tickets Now
</a>
```

#### Method 3: Popup Integration

Add this JavaScript to Squarespace (Code Injection):

```html
<script>
function openBookingPopup(showId, performanceId) {
    window.open(
        `https://eventseats.yourdomain.com/embed/${showId}/${performanceId}`,
        'booking',
        'width=800,height=600,scrollbars=yes,resizable=yes'
    );
}
</script>

<button onclick="openBookingPopup('show-id', 'performance-id')">
    Book Tickets
</button>
```

## ⚙️ Configuration for Production

### 1. Update Environment Variables

In your Vercel deployment, ensure:

```env
# Production URLs
NEXTAUTH_URL=https://eventseats.yourdomain.com
NEXT_PUBLIC_APP_URL=https://eventseats.yourdomain.com

# Security
NEXTAUTH_SECRET=your-super-long-random-secret-32-chars-minimum

# Database
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
```

### 2. Security Configuration

Update `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/embed/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://yourdomain.com;",
          },
        ],
      },
    ];
  },
};
```

### 3. Supabase Row Level Security

Enable RLS policies:

```sql
-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy examples (customize as needed)
CREATE POLICY "Users can only see their organization data" ON shows
FOR SELECT USING (organizationId = auth.jwt() ->> 'organizationId');
```

## 🔒 Security Checklist

- [ ] Strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Production Supabase project
- [ ] SSL certificate active
- [ ] CORS configured for your domain
- [ ] RLS enabled on all tables
- [ ] Demo credentials changed/removed
- [ ] Error logging configured
- [ ] Backup strategy in place

## 📊 Monitoring & Analytics

### Add Analytics to EventSeats

In `src/app/layout.tsx`:

```typescript
// Google Analytics
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Monitor Key Metrics

- Page views on booking pages
- Conversion rates (views → bookings)
- Revenue tracking
- Error rates
- Performance metrics

## 🎨 Branding Integration

### Match Squarespace Design

1. **Extract Squarespace Colors**
   - Inspect your Squarespace site
   - Note primary colors, fonts, styling
   - Update EventSeats CSS variables

2. **Custom Styling**
   Create `src/styles/custom.css`:
   ```css
   :root {
     --primary-color: #your-brand-color;
     --secondary-color: #your-secondary-color;
     --font-family: 'Your-Font', sans-serif;
   }
   ```

3. **Logo Integration**
   - Add your logo to `public/`
   - Update header component
   - Ensure consistent branding

## 🚀 Launch Checklist

### Pre-Launch
- [ ] Test booking flow end-to-end
- [ ] Verify payment processing (if enabled)
- [ ] Check mobile responsiveness
- [ ] Test embedding on Squarespace
- [ ] Verify email notifications work
- [ ] Load test with multiple users

### Launch Day
- [ ] Update DNS records
- [ ] Monitor error logs
- [ ] Test from different devices/browsers
- [ ] Announce to your audience
- [ ] Monitor performance metrics

### Post-Launch
- [ ] Set up monitoring alerts
- [ ] Regular backups verification
- [ ] Customer feedback collection
- [ ] Performance optimization
- [ ] Regular security updates

## 💡 Integration Ideas

### For Theatre/Venue Websites

1. **Show Listings Page**
   - Display shows from EventSeats API
   - Style to match Squarespace theme
   - Link to individual booking pages

2. **Upcoming Events Widget**
   ```html
   <div id="upcoming-events"></div>
   <script>
   fetch('https://eventseats.yourdomain.com/api/shows')
     .then(response => response.json())
     .then(data => {
       // Display upcoming shows
     });
   </script>
   ```

3. **Quick Booking Button**
   - Floating action button
   - Slides out booking interface
   - Minimal disruption to main site

## 🆘 Troubleshooting

### Common Issues

**Iframe not loading:**
- Check CORS configuration
- Verify iframe headers in next.config.ts
- Test embed URL directly

**DNS not propagating:**
- Wait 24 hours for full propagation
- Use DNS checker tools
- Clear browser DNS cache

**Authentication issues:**
- Verify NEXTAUTH_URL matches deployment URL
- Check Supabase project settings
- Confirm environment variables

### Getting Help

- 📚 **Documentation:** Full guides and API reference
- 💬 **GitHub Issues:** Technical problems and bugs
- 🔍 **Discord/Community:** Real-time help from other users

---

**Estimated Deployment Time:** 2-4 hours
**Cost:** $0-20/month depending on usage
**Difficulty:** Intermediate (with step-by-step guide)

Good luck with your deployment! 🎭✨
