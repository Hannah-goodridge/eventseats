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

## 2) Recommended flow (Checkout Session)

- Create a booking in "pending" with reserved seats and total price.
- Server creates a Checkout Session (Stripe-hosted page) and redirects the customer.
- On webhook `checkout.session.completed` or `payment_intent.succeeded`, mark booking as "confirmed" and store the `payment_intent` ID.
- On cancel/expired/failure, release seats.

### Server endpoints (expected)

- `POST /api/payments/create-session`
  - Input: `{ bookingId }` (from your app)
  - Server loads booking, validates seats and computes amount server-side
  - Creates Checkout Session with `mode: payment`, `line_items`, `success_url`, `cancel_url`, and `metadata: { bookingId }`
  - Responds with `session.url` for redirect

- `POST /api/stripe/webhook`
  - Verifies Stripe signature using `STRIPE_WEBHOOK_SECRET`
  - Handles events:
    - `checkout.session.completed` or `payment_intent.succeeded`: confirm booking, persist `payment_intent`
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
