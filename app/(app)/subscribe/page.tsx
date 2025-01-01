import { getProducts, getSubscription } from "@/actions/subscriptions";
import { getUser } from "@/actions/user";
import Pricing from "@/components/pricing";

export default async function PricingPage() {

    const [user, products, subscription] = await Promise.all([
        getUser(),
        getProducts(),
        getSubscription()
    ]);

    // Order the products by their price unit_amount ascending
    const sortedProducts = (products || []).sort((a, b) => {
        const aPrice = a.prices?.find((price) => price.active);
        const bPrice = b.prices?.find((price) => price.active);
        return (aPrice?.unit_amount || 0) - (bPrice?.unit_amount || 0);
    })

    return (
        <Pricing
            user={user}
            products={sortedProducts}
            subscription={subscription}
        />
    );
}