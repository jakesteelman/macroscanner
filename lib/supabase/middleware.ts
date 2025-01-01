import { getSubscription } from "@/actions/subscriptions";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {

    // Create an unmodified response
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value),
                    );
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options),
                    );
                },
            },
        },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    // old protected routes - we now protect everything but the auth pages, and / is the root.
    // if (request.nextUrl.pathname.startsWith("/protected") && user.error) {
    //   return NextResponse.redirect(new URL("/sign-in", request.url));
    // }

    // if (request.nextUrl.pathname === "/" && !user.error) {
    //   return NextResponse.redirect(new URL("/protected", request.url));
    // }

    const isOnAuthRoute = ['/sign-in', '/sign-up', '/forgot-password', '/auth/callback',].some(route => request.nextUrl.pathname.startsWith(route));

    // check if the path name does not start with any of the auth routes and the user is not logged in
    if (!isOnAuthRoute && user.error) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (isOnAuthRoute && !user.error) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return response;
};
