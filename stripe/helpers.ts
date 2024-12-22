import type { Tables } from '@/types/database.types';

type Price = Tables<'prices'>;

export const calculateTrialEndUnixTimestamp = (
    trialPeriodDays: number | null | undefined
) => {
    // Check if trialPeriodDays is null, undefined, or less than 2 days
    if (
        trialPeriodDays === null ||
        trialPeriodDays === undefined ||
        trialPeriodDays < 2
    ) {
        return undefined;
    }

    const currentDate = new Date(); // Current date and time
    const trialEnd = new Date(
        currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000
    ); // Add trial days
    return Math.floor(trialEnd.getTime() / 1000); // Convert to Unix timestamp in seconds
};

export const postData = async ({
    url,
    data
}: {
    url: string;
    data?: { price: Price };
}) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify(data)
    });

    return res.json();
};