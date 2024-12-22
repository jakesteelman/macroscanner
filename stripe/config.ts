// stripe/config.js
import Stripe from 'stripe'

export const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY ?? '',
    {
        apiVersion: '2024-12-18.acacia',
        appInfo: {
            name: "Macroscanner",
            version: "0.1.0",
            url: "https://app.macroscanner.com"
        }
    }
)