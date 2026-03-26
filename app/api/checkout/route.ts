import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder', {
  apiVersion: '2026-03-25.dahlia' as '2026-03-25.dahlia',
})

// Price IDs — create these in Stripe dashboard and replace
const PRICES = {
  weekly: process.env.STRIPE_WEEKLY_PRICE_ID || 'price_weekly_placeholder',
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly_placeholder',
}

export async function POST(req: NextRequest) {
  try {
    const { plan, userId } = await req.json()
    const priceId = PRICES[plan as keyof typeof PRICES]

    if (!priceId) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/results?session_id={CHECKOUT_SESSION_ID}&upgraded=true`,
      cancel_url: `${appUrl}/results?cancelled=true`,
      metadata: { userId: userId || 'anonymous' },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout]', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
