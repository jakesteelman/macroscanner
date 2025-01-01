"use server";

import { encodedRedirect } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const fullName = formData.get("fullName")?.toString();

    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    if (!email || !password) {
        return encodedRedirect(
            "error",
            "/sign-up",
            "Email and password are required",
        );
    }

    // Calculate trial end date (14 days from now in UTC)
    const trialEnd = new Date();
    trialEnd.setUTCDate(trialEnd.getUTCDate() + 14);

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
                full_name: fullName,
                trial_end_utc: trialEnd.toISOString(),
            }
        },
    });

    if (error) {
        console.error(error.code + " " + error.message);
        return encodedRedirect("error", "/sign-up", error.message);
    } else {
        return encodedRedirect(
            "success",
            "/sign-up",
            "Thanks for signing up! Please check your email for a verification link.",
        );
    }
};

export const signInAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return encodedRedirect("error", "/sign-in", error.message);
    }

    return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const supabase = await createClient();
    const origin = (await headers()).get("origin");
    const callbackUrl = formData.get("callbackUrl")?.toString();

    if (!email) {
        return encodedRedirect("error", "/forgot-password", "Email is required");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
    });

    if (error) {
        console.error(error.message);
        return encodedRedirect(
            "error",
            "/forgot-password",
            "Could not reset password",
        );
    }

    if (callbackUrl) {
        return redirect(callbackUrl);
    }

    return encodedRedirect(
        "success",
        "/forgot-password",
        "Check your email for a link to reset your password.",
    );
};

export const resetPasswordAction = async (formData: FormData) => {
    const supabase = await createClient();

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || !confirmPassword) {
        encodedRedirect(
            "error",
            "/reset-password",
            "Password and confirm password are required",
        );
    }

    if (password !== confirmPassword) {
        encodedRedirect(
            "error",
            "/reset-password",
            "Passwords do not match",
        );
    }

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        encodedRedirect(
            "error",
            "/reset-password",
            "Password update failed",
        );
    }

    encodedRedirect("success", "/reset-password", "Password updated");
};

export const signOutAction = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/sign-in");
};

// https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=platform&platform=web&queryGroups=framework&framework=nextjs#application-code
export const signInWithGoogleAction = async () => {

    const origin = (await headers()).get("origin");
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            skipBrowserRedirect: true,
            redirectTo: `${origin}/auth/callback`,
        }
    })

    if (error) {
        return encodedRedirect("error", "/sign-in", error.message);
    }

    if (data?.url) {
        return redirect(data.url);
    }

    return encodedRedirect("error", "/sign-in", "Could not sign in with Google");
};

export async function updateName(formData: FormData) {
    // Get form data
    const fullName = String(formData.get('fullName')).trim();
    const origin = (await headers()).get("origin");
    const supabase = await createClient();
    const { error, data } = await supabase.auth.updateUser({
        data: { full_name: fullName }
    });

    if (error) {
        return encodedRedirect(
            'error',
            '/settings/account',
            `Your name could not be updated: ` + error.message
        );
    } else if (data.user) {
        return encodedRedirect(
            'success',
            '/settings/account',
            'Success! Your name has been updated.'
        );
    } else {
        return encodedRedirect(
            'error',
            '/settings/account',
            'Hmm... Something went wrong. Your name could not be updated.'
        );
    }
}

export async function updateEmail(formData: FormData) {
    const email = String(formData.get('email')).trim();
    const supabase = await createClient();

    const { error, data } = await supabase.auth.updateUser({
        email: email,
    }, {
        emailRedirectTo: '/settings/account',
    });

    if (error) {
        return encodedRedirect(
            'error',
            '/settings/account',
            `Your email could not be updated: ` + error.message
        );
    } else if (data.user) {
        return encodedRedirect(
            'success',
            '/settings/account',
            'Please check your new email address for a verification link.'
        );
    } else {
        return encodedRedirect(
            'error',
            '/settings/account',
            'Hmm... Something went wrong. Your email could not be updated.'
        );
    }
}

export async function updatePassword(formData: FormData) {
    const password = String(formData.get('password'));
    const confirmPassword = String(formData.get('confirmPassword'));
    const supabase = await createClient();

    if (!password || !confirmPassword) {
        return encodedRedirect(
            'error',
            '/settings/account',
            'Both password fields are required'
        );
    }

    if (password !== confirmPassword) {
        return encodedRedirect(
            'error',
            '/settings/account',
            'Passwords do not match'
        );
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) {
        return encodedRedirect(
            'error',
            '/settings/account',
            `Password could not be updated: ${error.message}`
        );
    }

    return encodedRedirect(
        'success',
        '/settings/account',
        'Your password has been updated successfully'
    );
}