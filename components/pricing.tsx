'use client';
import { getStripe } from '@/stripe/client';
import { checkoutWithStripe, createStripePortal } from '@/stripe/server';
import { getErrorRedirect } from '@/lib/utils/helpers';
import { User } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { BillingInterval, Price, ProductWithPrices, SubscriptionWithProduct } from '@/types/pricing.types';
import { PricingCard } from './pricing/pricing-card';
import { BillingToggle } from './pricing/billing-toggle';
import Faq from './faq';

const pricingFaq = [
    {
        question: 'Are there annual plans available?',
        answer: 'Yes! If you choose to pay annually, you\'ll get 2 months free (16% off).'
    },
    {
        question: 'Do you offer refunds?',
        answer: 'We do not offer refunds. You can cancel your subscription at any time and will not be billed again, and you will still have access to Macroscanner until the end of your billing period.'
    },
    {
        question: 'How do I contact support?',
        answer: 'For billing related issues, you can contact billing@macroscanner.com, and for technical support, you can contact support@macroscanner.com. We also have a Reddit community at r/macroscanner.'
    }
]

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
            '/subscribe/success'
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
            <section className="">
                <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:flex-col sm:align-center"></div>
                    <p className="text-4xl font-extrabold sm:text-center sm:text-6xl">
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
            <div className="grid grid-cols-2 gap-8 py-8 sm:py-12">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                            Subscribe to Macroscanner
                        </h1>
                        <p className="max-w-2xl mt-5 text-lg text-muted-foreground">
                            For less than a $2 per week, you can unlock all the
                            features and convenience of Macroscanner and support
                            our independent development team.
                        </p>
                    </div>
                    <Faq faq={pricingFaq} />
                </div>
                <div className="flex flex-col items-start justify-stretch gap-8">
                    <BillingToggle
                        intervals={intervals}
                        billingInterval={billingInterval}
                        onIntervalChange={setBillingInterval}
                        className='w-full'
                    />
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
        );
    }
}