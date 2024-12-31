// @/components/forms/customer-portal-form
'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { createStripePortal } from '@/stripe/server';
import Link from 'next/link';
import { Tables } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

type Subscription = Tables<'subscriptions'>;
type Price = Tables<'prices'>;
type Product = Tables<'products'>;

type SubscriptionWithPriceAndProduct = Subscription & {
    prices:
    | (Price & {
        products: Product | null;
    })
    | null;
};

interface Props {
    subscription: SubscriptionWithPriceAndProduct | null;
}

export default function CustomerPortalForm({ subscription }: Props) {
    const router = useRouter();
    const currentPath = usePathname();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const subscriptionPrice =
        subscription &&
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: subscription?.prices?.currency!,
            minimumFractionDigits: 0
        }).format((subscription?.prices?.unit_amount || 0) / 100);

    const handleStripePortalRequest = async () => {
        setIsSubmitting(true);
        const redirectUrl = await createStripePortal(currentPath);
        setIsSubmitting(false);
        return router.push(redirectUrl);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Current plan
                </CardTitle>
                <CardDescription>
                    <p className="text-muted-foreground">
                        {subscription
                            ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
                            : 'You\'re currently using Macroscanner Free.'}
                    </p>
                </CardDescription>
            </CardHeader>

            <CardContent>
                {subscription ? (
                    `${subscriptionPrice}/${subscription?.prices?.interval}`
                ) : (
                    <Link href="/subscribe">Subscribe</Link>
                )}
            </CardContent>

            <CardFooter>
                <Button onClick={handleStripePortalRequest} disabled={isSubmitting}>
                    Manage Subscription
                </Button>
            </CardFooter>
        </Card>
    );
}