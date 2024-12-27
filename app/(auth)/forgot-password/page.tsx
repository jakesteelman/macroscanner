import { forgotPasswordAction } from "@/actions/auth";
import FormMessage, { Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function ForgotPassword(props: {
    searchParams: Promise<Message>;
}) {
    const searchParams = await props.searchParams;
    return (
        <>
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Reset password</CardTitle>
                        <CardDescription>
                            Enter your email address and we'll send you a link to reset your password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
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
                                <SubmitButton pendingText="Sending reset email..." formAction={forgotPasswordAction} >
                                    Send reset email
                                </SubmitButton>
                                <FormMessage message={searchParams} />
                                <div className="text-center text-sm">
                                    Remembered it?{" "}
                                    <Link href="/sign-in" className={cn(buttonVariants({ variant: "link", size: 'sm' }), 'p-0 h-auto')} >
                                        Sign in
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
