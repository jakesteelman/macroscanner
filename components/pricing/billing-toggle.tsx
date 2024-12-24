import { BillingInterval } from '@/types/pricing.types';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface BillingToggleProps {
    intervals: (BillingInterval | undefined)[];
    billingInterval: BillingInterval;
    onIntervalChange: (interval: BillingInterval) => void;
}

export function BillingToggle({
    intervals,
    billingInterval,
    onIntervalChange
}: BillingToggleProps) {
    return (
        <div className="relative grid grid-cols-2 gap-2 self-center mt-6 rounded-lg p-1.5 sm:mt-8 border">
            {intervals.includes('month') && (
                <button
                    onClick={() => onIntervalChange('month')}
                    type="button"
                    className={cn(
                        billingInterval === 'month' ? 'relative shadow-sm bg-muted text-foreground' : 'relative border border-transparent',
                        'flex gap-1.5 items-center justify-center rounded-md  py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8')}
                >
                    Monthly
                </button>
            )}
            {intervals.includes('year') && (
                <button
                    onClick={() => onIntervalChange('year')}
                    type="button"
                    className={cn(
                        billingInterval === 'year' ? 'relative shadow-sm bg-muted text-foreground' : 'relative border border-transparent',
                        'flex gap-1.5 items-center justify-center rounded-md  py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8'
                    )}
                >
                    Annual
                    <Badge className="bg-gradient-to-r from-[#926c15] to-[#b69121] dark:from-[#a47e1b] dark:to-[#c9a227] border-0 text-background">Save 16%</Badge>
                </button>
            )}
        </div>
    );
}
