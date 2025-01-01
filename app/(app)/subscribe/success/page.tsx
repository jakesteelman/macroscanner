import { getProducts, getSubscription } from "@/actions/subscriptions";
import { getUser } from "@/actions/user";
import Link from 'next/link';
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Headset } from 'lucide-react';

export default async function SubscriptionSuccessPage() {

    const [user, products, subscription] = await Promise.all([
        getUser(),
        getProducts(),
        getSubscription()
    ]);

    return (
        <div className="mx-auto py-6 max-w-5xl">
            <header className="text-center mb-12 flex flex-col items-center justify-center gap-4">
                <span className="big-ass-emoji text-7xl mb-4">🎉</span>
                <h1 className="text-5xl font-semibold tracking-tight">Welcome to Macroscanner!</h1>
                <p className="text-xl text-muted-foreground">You've just unlocked a faster, more convenient way to log nutrition.</p>
                <Link href="/" className={buttonVariants({ variant: 'default' })}>
                    Go to Your Dashboard
                </Link>
            </header>

            <div className="grid gap-8 md:grid-cols-2">
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">What's Next?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="grid gap-4 sm:grid-cols-2">
                            {[
                                "Take your first food photo",
                                "Set up nutrition goals",
                                "Explore meal planning",
                                "Join our community"
                            ].map((item, index) => (
                                <li key={index} className="flex items-center">
                                    <ArrowRight className="mr-2 text-primary" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Roadmap & Feature Requests
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        See what we're working on and planning to release, and request features you want to see.
                    </CardContent>
                    <CardFooter>
                        <Link href="https://macroscanner.canny.io/" target="_blank" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                            Roadmap
                        </Link>
                        <Link href="https://macroscanner.canny.io/feature-requests/" target="_blank" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                            Feature Request
                        </Link>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Join Our Community
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        Visit our Reddit community to connect fellow users, share tips, and get inspired.
                    </CardContent>
                    <CardFooter>
                        <Link href="https://reddit.com/r/macroscanner" target="_blank" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                            Visit r/macroscanner
                        </Link>
                    </CardFooter>
                </Card>

                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle>Need Help?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Our support team is here for you. Please don't hesitate to reach out if you have any questions or need assistance.
                    </CardContent>
                    <CardFooter>
                        <Link href="/support" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                            <Headset className="size-4" />
                            Contact Support
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}