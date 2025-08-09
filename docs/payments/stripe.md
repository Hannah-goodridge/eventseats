# Stripe Payments (Hosted Checkout)

Use Stripe Checkout to accept payments without handling card data. This keeps PCI scope minimal and supports refunds via dashboard or API.

## Prerequisites

- A Stripe account (free to start)
- This app running locally or deployed
- Test mode enabled in Stripe while integrating

## 1) Environment variables

Add these to your `.env.local` (or hosting provider env):

```env
# Stripe Payments
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
# Set via Stripe CLI for local dev, or copy from Dashboard Webhooks in production
STRIPE_WEBHOOK_SECRET=whsec_...
```

Notes:
- Keep `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` server-only.
- If you fork this project, never commit real keys.

## 2) Flow implemented (Checkout Session)

- Server creates a PENDING booking with reserved seats, then creates a Checkout Session and redirects the customer.
- Webhook finalizes to PAID on success (or creates if not pre-reserved), and should release seats on failure/expired.
- Success page supports `{CHECKOUT_SESSION_ID}` and falls back to `?bookingId=` to handle webhook delay.

### Server endpoints (expected)

- `POST /api/payments/create-session`
  - Input: `{ performanceId, customer, seats }`
  - Server validates performance, computes total from server-side prices, ensures `customers` row
  - Pre-creates PENDING booking and `booking_items` for seat holds
  - Creates Checkout Session with `metadata: { bookingId, performanceId, showId, seatsJson }`
  - Returns `session.url`

- `POST /api/stripe/webhook`
  - Verifies Stripe signature using `STRIPE_WEBHOOK_SECRET`
  - Handles events:
    - `checkout.session.completed` or `payment_intent.succeeded`: finalize booking (update PENDING to PAID), persist `payment_intent`
    - `payment_intent.payment_failed`: mark failed and release seats
    - `checkout.session.expired`: release seats

Security essentials:
- Never trust the client for pricing. Compute amount server-side from booking data.
- Use idempotency keys when creating sessions to avoid duplicates on retries.
- Verify webhook signatures.

## 3) Local development (webhooks)

Use the Stripe CLI to receive webhooks locally:

```bash
# Install once (macOS via Homebrew)
brew install stripe/stripe-cli/stripe

# Authenticate
stripe login

# Forward webhooks to your app
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The CLI will print a `whsec_...` secret. Set it as `STRIPE_WEBHOOK_SECRET` in `.env.local`, then restart your dev server.

Test cards: use the Stripe test cards documented in the Stripe docs (e.g., 4242 4242 4242 4242) in test mode. See [Stripe Test Cards](https://docs.stripe.com/testing#cards).

## 4) Production setup

1. In the Stripe Dashboard, go to Webhooks and add an endpoint:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `checkout.session.expired`
2. Copy the generated signing secret and set `STRIPE_WEBHOOK_SECRET` in your hosting environment (e.g., Vercel Project Settings).
3. Ensure `STRIPE_SECRET_KEY` uses your live key and your app uses live mode.
4. Redirect URLs in your Checkout Session must be HTTPS and point to your production domain.

## 5) Refunds

You can refund from the Stripe Dashboard or via API.

- Dashboard: Open the payment → Refund → choose full or partial.
- API (server-side): create a refund using the stored `payment_intent`:

```ts
// Example (Node/TypeScript)
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

await stripe.refunds.create({
  payment_intent: paymentIntentId,
  // amount: 500, // optional for partial refund in the currency's smallest unit
})
```

Recommended: expose an admin-only action that validates the booking and calls the refund API. Store refund IDs for audit.

## 6) Configuration tips

- Currency: set a consistent currency (e.g., GBP/EUR/USD) in your pricing and Checkout Session.
- Metadata: include `bookingId`, `showId`, `performanceId` in `metadata` for easier reconciliation.
- Expiry: set `expires_at` on Checkout Sessions (optional) so seats are freed promptly on abandonment.
- Payment methods: enable Apple Pay/Google Pay and relevant local methods in the Stripe Dashboard; Checkout will adapt automatically.

## 7) Troubleshooting

- Webhook signature verification failing
  - Ensure you are using the correct `STRIPE_WEBHOOK_SECRET` for the environment (local vs production)
  - Do not JSON-parse the body before signature verification; use the raw body
- Session created but redirect fails
  - Use absolute `success_url` and `cancel_url`
- Bookings stuck in pending
  - Confirm your webhook is reachable and subscribed to the right events

## References

- [Stripe Checkout Overview](https://docs.stripe.com/checkout)
- [Checkout Session API](https://docs.stripe.com/api/checkout/sessions)
- [Webhooks](https://docs.stripe.com/webhooks)
- [Refunds](https://docs.stripe.com/refunds)
