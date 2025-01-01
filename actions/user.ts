"use server"
import { createClient } from "@/lib/supabase/server"
import { getSubscription } from "./subscriptions"
import { User } from '@supabase/supabase-js'
import { trialStatus } from "@/lib/utils/helpers"

type SubscribedUser = User & {
    isMember: boolean
    subscription: Awaited<ReturnType<typeof getSubscription>> | null
} | null

/**
 * Validates and returns user data from auth response
 */
async function validateUser(response: { data: { user: User | null }, error: any }) {
    const { data: { user }, error: authError } = response

    if (authError) {
        throw authError
    }

    return user
}

/**
 * Gets the current authenticated user
 */
export async function getUser(): Promise<User | null> {
    const supabase = await createClient()
    const response = await supabase.auth.getUser()
    return validateUser(response)
}

/**
 * Gets the current authenticated user with subscription status
 */
export async function getSubscribedUser(): Promise<SubscribedUser> {
    const supabase = await createClient()

    const [userResponse, subscription] = await Promise.all([
        supabase.auth.getUser(),
        getSubscription()
    ])

    const user = await validateUser(userResponse)

    if (!user) {
        return null
    }

    const userInTrialPeriod = trialStatus(user.user_metadata.trial_end_utc) === 'active'
    const userHasSubscription = (subscription && (subscription?.status === 'active' || subscription?.status === 'trialing')) ? true : false

    return {
        ...user,
        subscription,
        isMember: userInTrialPeriod || userHasSubscription
    }
}