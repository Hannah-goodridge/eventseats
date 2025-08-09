import Stripe from 'stripe'

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe is not configured (missing STRIPE_SECRET_KEY)')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}


