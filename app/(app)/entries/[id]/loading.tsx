import { Suspense } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import SupabaseImage from '@/components/supabase-image';
import { Skeleton } from '@/components/ui/skeleton';
import PredictionCard from '@/components/prediction-card';
import NutritionFactsDialog from '@/components/dialogs/nutrition-facts-dialog';
import TextSummaryDialog from '@/components/dialogs/text-summary-dialog';
import { Badge } from '@/components/ui/badge';
import { MacroBreakdownPie } from '@/components/macro-breakdown-pie2';
import { Button } from '@/components/ui/button';
import PredictionCardSkeleton from '@/components/loading/prediction-card-skeleton';
import { ScanBarcode, ScanText } from 'lucide-react';

export default async function LoadingPage() {
    return (
        <div className="container mx-auto px-0">
            <div className="space-y-8">
                <div className='w-full grid grid-cols-3 gap-6 lg:gap-12'>
                    <div className='col-span-2 flex flex-col gap-4 lg:gap-6'>
                        <div className='flex flex-col gap-2'>
                            <Skeleton className="h-12 max-w-sm" />
                            <Skeleton className='h-6 w-48' />
                        </div>
                        <div className='w-full flex flex-row items-center justify-start gap-4'>
                            <Button variant='outline'>
                                <ScanBarcode className='size-4' />
                                Nutrition Facts
                            </Button>
                            <Button variant='outline' size='sm'>
                                <ScanText className='size-4' />
                                Text Summary
                            </Button>
                        </div>
                        <div>
                            <div className='mb-2 flex flex-row items-center justify-between'>
                                <h2 className="text-xl font-semibold">Predictions</h2>
                            </div>
                            <div className='w-full flex flex-col items-stretch justify-start gap-4'>
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <PredictionCardSkeleton key={`prediction-loading-${i}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        {/* <ScrollArea className="w-full rounded-md">
                            <MacroBreakdownPie nutritionFacts={nutritionFacts} />
                            <div className="mt-4 flex flex-col items-start justify-stretch gap-4">
                                {entry.photos.map((photo, index) => (
                                    <div key={index} className="relative group w-full flex-shrink-0">
                                        <Suspense key={photo.id} fallback={<Skeleton className='h-56 aspect-square' />}>
                                            <SupabaseImage
                                                path={photo.photo_url}
                                                alt={`Food image ${index + 1}`}
                                                width={300}
                                                height={300}
                                                className="relative w-auto rounded-md object-cover"
                                            />
                                        </Suspense>
                                    </div>
                                ))}
                            </div>
                            <ScrollBar orientation='vertical' />
                        </ScrollArea> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
