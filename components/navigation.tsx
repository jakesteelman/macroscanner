import Link from 'next/link';
import React from 'react';
import Logo from './logo';
import HeaderAuth from "@/components/header-auth";
import { getSubscription } from '@/actions/subscriptions';
import { getUser } from '@/actions/user';
import Banner from './ui/banner';
import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

type Props = {} & React.HTMLAttributes<HTMLDivElement>

/**
 * Navigation bar component
 * 
 * Renders a global navigation bar that appears across the entire application.
 * 
 * @param props 
 * @returns 
 */
export default async function NavigationBar({
    ...props
}: Props) {

    const user = await getUser();
    const subscription = await getSubscription();

    const userHasSubscription = subscription && (subscription.status === 'active' || subscription.status === 'trialing');
    const userTrialPeriodEnded = user && user.user_metadata.trial_end_utc && new Date(user.user_metadata.trial_end_utc) < new Date();

    const stringFormattedTimeUntilTrialEnds = user?.user_metadata.trial_end_utc ? (() => {
        const trialEnd = new Date(user.user_metadata.trial_end_utc);
        const now = new Date();
        const daysLeft = differenceInDays(trialEnd, now) + 1;
        const hoursLeft = differenceInHours(trialEnd, now) + 1;
        const minutesLeft = differenceInMinutes(trialEnd, now);

        if (daysLeft > 0) return `${daysLeft} days`;
        if (hoursLeft > 0) return `${hoursLeft} hours`;
        return `${minutesLeft} minutes`;
    })() : '';

    return (
        <div>
            {(user && userTrialPeriodEnded && !userHasSubscription) ? (
                <Banner>
                    Your trial has ended. Please <Link href="/subscribe">subscribe</Link> to continue using Macroscanner.
                </Banner>
            ) : user && !userTrialPeriodEnded && !userHasSubscription ? (
                <Banner>
                    Your trial ends in {stringFormattedTimeUntilTrialEnds}. Please <Link
                        href="/subscribe?utm_source=trial_ended_banner&utm_medium=macroscanner&utm_campaign=trial_ended_banner"
                        className='border-b border-current'
                    >subscribe</Link> to continue using Macroscanner after your trial ends.
                </Banner>
            ) : null}
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16" {...props}>
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                    <Link href="/" className='flex items-center gap-2'>
                        <Logo className='h-7' />
                    </Link>
                    <div className='flex gap-4 items-center justify-end'>
                        <HeaderAuth />
                    </div>
                </div>
            </nav>
        </div>
    );
}