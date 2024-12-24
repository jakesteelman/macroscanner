'use client';
import { getStripe } from '@/stripe/client';
import { checkoutWithStripe, createStripePortal } from '@/stripe/server';
import { getErrorRedirect } from '@/lib/utils/helpers';
import { User } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { BillingInterval, Price, ProductWithPrices, SubscriptionWithProduct } from '@/types/pricing.types';
import { PricingCard } from './pricing/pricing-card';
import { BillingToggle } from './pricing/billing-toggle';
import { manageSubscriptionStatusChange } from '@/lib/supabase/admin';

interface PricingProps {
    user: User | null | undefined;
    products: ProductWithPrices[];
    subscription: SubscriptionWithProduct | null;
}

export default function Pricing({ user, products, subscription }: PricingProps) {
    const intervals = Array.from(
        new Set(
            products.flatMap((product) =>
                product?.prices?.map((price) => price?.interval)
            )
        )
    ) as BillingInterval[];
    const router = useRouter();
    const [billingInterval, setBillingInterval] = useState<BillingInterval>('month');
    const [priceIdLoading, setPriceIdLoading] = useState<string>();
    const currentPath = usePathname();

    const handleStripeCheckout = async (price: Price) => {
        setPriceIdLoading(price.id);

        if (!user) {
            setPriceIdLoading(undefined);
            return router.push('/sign-in');
        }

        // Check if we are subscribed to this plan ID already.
        if (
            subscription &&
            subscription.price_id === price.id
        ) {
            setPriceIdLoading(undefined);
            return router.push(await createStripePortal(currentPath))
        }

        const { errorRedirect, sessionId } = await checkoutWithStripe(
            price,
            currentPath
        );

        if (errorRedirect) {
            setPriceIdLoading(undefined);
            return router.push(errorRedirect);
        }

        if (!sessionId) {
            setPriceIdLoading(undefined);
            return router.push(
                getErrorRedirect(
                    currentPath,
                    'An unknown error occurred.',
                    'Please try again later or contact a system administrator.'
                )
            );
        }

        const stripe = await getStripe();
        stripe?.redirectToCheckout({ sessionId });

        setPriceIdLoading(undefined);
    };

    if (!products.length) {
        return (
            <section className="bg-black">
                <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:flex-col sm:align-center"></div>
                    <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
                        No subscription pricing plans found. Create them in your{' '}
                        <a
                            className="text-primary underline"
                            href="https://dashboard.stripe.com/products"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            Stripe Dashboard
                        </a>
                        .
                    </p>
                </div>
            </section>
        );
    } else {
        return (
            <section className="">
                <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:flex-col sm:align-center">
                        <h1 className="text-4xl font-semibold tracking-tight sm:text-center sm:text-6xl">
                            Macroscanner <span className='text-transparent bg-clip-text bg-gradient-to-tr from-[#926c15] to-[#b69121] dark:from-[#a47e1b] dark:to-[#c9a227]'>PRO</span>
                        </h1>
                        <p className="max-w-2xl m-auto mt-5 text-xl sm:text-center sm:text-2xl">
                            For less than a cup of coffee a month, you can unlock all the
                            features of Macroscanner and support its development.
                        </p>
                        <BillingToggle
                            intervals={intervals}
                            billingInterval={billingInterval}
                            onIntervalChange={setBillingInterval}
                        />
                    </div>
                    <div className="mt-12 space-y-0 sm:mt-16 grid grid-cols-2 gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
                        {products.map((product) => (
                            <PricingCard
                                key={product.id}
                                product={product}
                                subscription={subscription}
                                billingInterval={billingInterval}
                                priceIdLoading={priceIdLoading}
                                onCheckout={handleStripeCheckout}
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }
}