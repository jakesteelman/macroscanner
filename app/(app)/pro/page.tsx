// page.tsx under the desired route, example: /pricing

import { getProducts, getSubscription } from "@/actions/subscriptions";
import { getUser } from "@/actions/user";
import Pricing from "@/components/pricing";

export default async function PricingPage() {

    const [user, products, subscription] = await Promise.all([
        getUser(),
        getProducts(),
        getSubscription()
    ]);

    return (
        <Pricing
            user={user}
            products={products ?? []}
            subscription={subscription}
        />
    );
}