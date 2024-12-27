import React from 'react'
import { GoogleIcon } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { signInWithGoogleAction } from '@/actions/auth'

export default function GoogleAuthButton() {
    return (
        <form id="google-sign-in-form">
            <Button variant="outline" className="w-full gap-2" type='submit' formAction={signInWithGoogleAction}>
                <GoogleIcon className="h-6 w-6" />
                Log in with Google
            </Button>
        </form>
    );
}