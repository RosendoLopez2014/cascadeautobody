import Stripe from "stripe";

// Create a lazy-loaded Stripe instance to avoid build-time errors
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripeInstance = new Stripe(key, {
      apiVersion: "2024-12-18.acacia",
      typescript: true,
    });
  }
  return stripeInstance;
}

// For backwards compatibility (will throw if no key is set)
export const stripe = {
  get instance() {
    return getStripe();
  },
  get paymentIntents() {
    return getStripe().paymentIntents;
  },
  get customers() {
    return getStripe().customers;
  },
  get paymentMethods() {
    return getStripe().paymentMethods;
  },
  get setupIntents() {
    return getStripe().setupIntents;
  },
};

// Helper to format amount for Stripe (converts dollars to cents)
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100);
}

// Helper to format amount from Stripe (converts cents to dollars)
export function formatAmountFromStripe(amount: number): number {
  return amount / 100;
}
