import { signInAction } from "@/actions/auth";
import GoogleAuthButton from "@/components/auth/sign-in-google-button";
import FormMessage, { Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function SignIn(props: { searchParams: Promise<Message> }) {
    const searchParams = await props.searchParams;
    return (
        <div className={cn("flex flex-col gap-6")} >
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Sign in below to start scanning.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="flex flex-col gap-4">
                            <GoogleAuthButton />
                        </div>
                        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                            <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                        <form id="sign-in-form">
                            <div className="grid gap-6">
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
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <Link
                                            href="/forgot-password"
                                            className={cn(buttonVariants({ variant: "link", size: 'sm' }), '!p-0 ml-auto h-auto text-sm')}
                                            tabIndex={4}
                                        >
                                            Forgot?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        placeholder="Enter your password..." />
                                </div>
                                <SubmitButton pendingText="Signing In..." formAction={signInAction} form="sign-in-form">
                                    Sign in
                                </SubmitButton>
                                <FormMessage message={searchParams} />
                            </div>
                        </form>
                        <div className="text-center text-sm">
                            Don't have an account?{" "}
                            <Link href="/sign-up" className={cn(buttonVariants({ variant: "link", size: 'sm' }), 'p-0 h-auto')} >
                                Sign up
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                By clicking continue, you agree to our <Link href="https://macroscanner.com/legal/terms-of-service" target="_blank">Terms of Service</Link>{" "}
                and <Link href="https://macroscanner.com/legal/privacy-policy" target="_blank">Privacy Policy</Link>.
            </div>
        </div>
    );
}
