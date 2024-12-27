import { signUpAction } from "@/actions/auth";
import GoogleAuthButton from "@/components/auth/sign-in-google-button";
import FormMessage, { Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function Signup(props: {
    searchParams: Promise<Message>;
}) {
    const searchParams = await props.searchParams;
    if ("message" in searchParams) {
        return (
            <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
                <FormMessage message={searchParams} />
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Sign up</CardTitle>
                        <CardDescription>
                            Welcome! Sign up below to start scanning.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                    <GoogleAuthButton />
                                </div>
                                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                        Or sign up with
                                    </span>
                                </div>
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="fullName">Name</Label>
                                        <Input
                                            id="fullName"
                                            type="text"
                                            name="fullName"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            minLength={8}
                                            required
                                            placeholder="Create a strong password..." />
                                    </div>
                                    <SubmitButton pendingText="Signing up..." formAction={signUpAction} >
                                        Sign up
                                    </SubmitButton>
                                    <FormMessage message={searchParams} />
                                </div>
                                <div className="text-center text-sm">
                                    Already have an account?{" "}
                                    <Link href="/sign-in" className={cn(buttonVariants({ variant: "link", size: 'sm' }), 'p-0 h-auto')} >
                                        Sign in
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                    By clicking 'Sign up', you agree to our <Link href="https://macroscanner.com/legal/terms-of-service" target="_blank">Terms of Service</Link>{" "}
                    and <Link href="https://macroscanner.com/legal/privacy-policy" target="_blank">Privacy Policy</Link>.
                </div>
            </div>
        </>
    );
}
