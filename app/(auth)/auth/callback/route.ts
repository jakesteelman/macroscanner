import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {

            // Add a trial end date for the user if not present.
            if (!data.user.user_metadata.trial_end_utc) {
                // Supabase doesn't let you set user_metadata when a user signs *up* with an
                // Oauth provider, so we have to update this after the fact.
                const trialEnd = new Date()
                trialEnd.setUTCDate(trialEnd.getUTCDate() + 14)

                await supabase.auth.updateUser({
                    data: {
                        trial_end_utc: trialEnd.toISOString()
                    }
                })
            }

            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'

            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}