// page.tsx
import { redirect } from 'next/navigation';
import { getUser } from '@/actions/user';
import { getSubscription } from '@/actions/subscriptions';
import CustomerPortalForm from '@/components/forms/customer-portal-form';

export default async function SubscriptionPage() {

    const [user, subscription] = await Promise.all([
        getUser(),
        getSubscription()
    ]);

    if (!user) {
        return redirect('/signin');
    }

    return (
        <CustomerPortalForm subscription={subscription} />
    );
}