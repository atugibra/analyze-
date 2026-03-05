/**
 * Stripe Monetization Utilities
 * 
 * Note: Since npm is not available in this local environment to install `stripe`, 
 * this file outlines the architecture for the Stripe Checkout and Webhook implementation.
 * 
 * Instructions for User once deployed to Vercel:
 * 1. Install Stripe: `npm install stripe`
 * 2. Add keys to Vercel Environment Variables:
 *    - STRIPE_SECRET_KEY=sk_test_...
 *    - STRIPE_WEBHOOK_SECRET=whsec_...
 *    - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
 */

// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2023-10-16',
// });

export const stripeUtils = {
    /**
     * Creates a checkout session for a user to upgrade to Premium
     * @param userEmail The email of the currently logged-in user
     * @param userId The ID of the user (to map the successful payment back to them)
     */
    createCheckoutSession: async (userEmail: string, userId: string): Promise<string> => {
        // 1. In production, call Stripe API to create a session for your "Premium Monthly" Price ID
        /*
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          customer_email: userEmail,
          client_reference_id: userId,
          line_items: [
            {
              price: 'price_H5ggYwtDq4fbrJ', // Replace with your actual Stripe Price ID
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
        });
        return session.url;
        */

        console.log(`[STRIPE MOCK] Creating checkout session for ${userEmail} (${userId})`);
        return "https://mock-stripe-checkout-url.com";
    },

    /**
     * Webhook Handler Blueprint (To be placed in app/api/webhooks/stripe/route.ts)
     * This listens for successful payments from Stripe and updates the user's role in the DB to "premium_user"
     */
    handleWebhook: async (reqBody: string, signature: string) => {
        // 1. Verify webhook signature using STRIPE_WEBHOOK_SECRET
        // 2. Parse event type (e.g., "checkout.session.completed" or "customer.subscription.updated")
        // 3. Extract customer email or client_reference_id
        // 4. Update the Database (Supabase or Railway PostgreSQL):
        //    UPDATE users SET role = 'premium_user', subscription_status = 'active' WHERE id = client_reference_id;

        console.log("[STRIPE MOCK] Webhook processed successfully");
        return { received: true };
    }
}
