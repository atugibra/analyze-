/**
 * Supabase Authentication & Role Utilities
 * 
 * Note: Since npm is not available in this environment to install `@supabase/supabase-js`, 
 * this file acts as the architectural blueprint for the Auth mechanisms.
 * Once deployed to Vercel (or when npm is available), install the client:
 * `npm install @supabase/supabase-js`
 */

// import { createClient } from '@supabase/supabase-js'

export type UserRole = "free_user" | "premium_user" | "admin"

export interface UserProfile {
    id: string
    email: string
    role: UserRole
    stripe_customer_id?: string
    subscription_status?: "active" | "past_due" | "canceled" | "none"
}

// Placeholder for Supabase Client Initialization
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const authUtils = {
    /**
     * Mock function to get the current user session
     */
    getCurrentSession: async (): Promise<UserProfile | null> => {
        // In production, this will call supabase.auth.getSession()
        // For now, we return a mock user for UI development
        return {
            id: "mock-user-123",
            email: "user@example.com",
            role: "free_user", // Change this to "premium_user" or "admin" to test UI gates
            subscription_status: "none"
        }
    },

    /**
     * Helper to check if a user has access to premium features (Predictions, H2H Pro)
     */
    hasPremiumAccess: (user: UserProfile | null): boolean => {
        if (!user) return false;
        return user.role === "premium_user" || user.role === "admin";
    },

    /**
     * Helper to check if a user has access to Admin features (Sync / Data)
     */
    hasAdminAccess: (user: UserProfile | null): boolean => {
        if (!user) return false;
        return user.role === "admin";
    }
}
