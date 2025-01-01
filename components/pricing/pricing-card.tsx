import { cn } from '@/lib/utils';
import { BillingInterval, Price, ProductWithPrices, SubscriptionWithProduct } from '@/types/pricing.types';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface PricingCardProps {
    product: ProductWithPrices;
    subscription: SubscriptionWithProduct | null;
    billingInterval: BillingInterval;
    priceIdLoading?: string;
    onCheckout: (price: Price) => void;
}

export function PricingCard({
    product,
    subscription,
    billingInterval,
    priceIdLoading,
    onCheckout
}: PricingCardProps) {

    const price = product?.prices?.find(
        (price) => price.interval === billingInterval
    );
    // FIXME: hooks can't be called conditionally
    if (!price) return null;

    const priceString = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: price.currency!,
        minimumFractionDigits: 0
    }).format((price?.unit_amount || 0) / 100);

    const handleCtaClicked = useCallback(() => {
        onCheckout(price);
    }, [onCheckout, price]);

    return (
        <Card
            className={cn(
                'flex flex-col rounded-lg shadow-sm',
                'flex-1',
                'basis-1/2'
            )}
        >
            <CardHeader className='pb-6'>
                <CardTitle className="text-2xl font-semibold leading-6 mb-2">
                    <div className='flex flex-row items-center justify-between'>
                        <span>{product.name}</span>
                        <p className="">
                            <span className="font-semibold text-foreground">
                                {priceString}
                            </span>
                            <span className="text-base font-medium text-muted-foreground">
                                /{billingInterval === 'month' ? 'mo' : billingInterval === 'year' ? 'yr' : billingInterval}
                            </span>
                        </p>
                    </div>
                </CardTitle>
                <CardDescription className="text-base">
                    {product.description}
                </CardDescription>
            </CardHeader>
            <CardContent className='px-6 pb-6 flex-grow'>
                {product.marketing_features?.map((feature, index) => {
                    // @ts-expect-error Supabase json type fucking sucks
                    const featureName = feature['name'];
                    return (
                        <div key={index} className='flex flex-row items-start justify-start text-muted-foreground'>
                            <Check className={cn("text-primary",
                                "size-6"
                            )} />
                            <span className="ml-2">{featureName}</span>
                        </div>
                    )
                })}
            </CardContent>
            <CardFooter className='w-full flex items-stretch justify-stretch'>
                <Button
                    variant="default"
                    type="button"
                    disabled={priceIdLoading === price.id}
                    onClick={handleCtaClicked}
                    className='w-full '
                >
                    {priceIdLoading === price.id && <Loader2 className="size-6 animate-spin" />}
                    {subscription ? 'Manage' : 'Subscribe'}
                </Button>
            </CardFooter>
        </Card>
    );
}
