import { Suspense } from 'react';
import { getEntry } from '@/actions/entries';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import SupabaseImage from '@/components/supabase-image';
import { Skeleton } from '@/components/ui/skeleton';
import PredictionCard from '@/components/prediction-card';
import { meal } from '@/lib/utils/conversion';
import { format } from 'date-fns';
import NutritionFactsDialog from '@/components/dialogs/nutrition-facts-dialog';
import TextSummaryDialog from '@/components/dialogs/text-summary-dialog';
import { Badge } from '@/components/ui/badge';
import { MacroBreakdownPie } from '@/components/macro-breakdown-pie2';

export default async function Page({ params }: Readonly<{ params: Promise<{ id: string }> }>) {

    const { id } = await params;

    return (
        <div className="container mx-auto px-0">
            <EntryDetails id={id} />
        </div>
    )
}

async function EntryDetails({ id }: { id: string }) {
    const entry = await getEntry(id)

    const allPredictions = entry.photos.map(photo => photo.predictions).flat()
    const textDescription = allPredictions.map(prediction => {
        return `${prediction.corrected_quantity ?? prediction.quantity} ${prediction.corrected_unit ?? prediction.unit} ${prediction.corrected_name ?? prediction.name}`
    }).join(',\n')

    const items = allPredictions.map(prediction => {
        const usdaFood = prediction.corrected_usda_food ?? prediction.usda_food
        if (!usdaFood) return null;
        return {
            usdaFood,
            quantity: prediction.corrected_quantity ?? prediction.quantity,
            unit: prediction.corrected_unit ?? prediction.unit
        }
    }).filter(item => !!item && item !== null)

    const { nutritionFacts, totalWeight } = meal({ items })

    const hasIncompletePredictions = allPredictions.some(prediction => !prediction.usda_food && !prediction.corrected_usda_food)

    return (
        <div className="space-y-8">
            <div className='w-full grid grid-cols-3 gap-6 lg:gap-12'>
                <div className='col-span-2 flex flex-col gap-4 lg:gap-6'>
                    <div className='flex flex-col gap-2'>
                        <h1 className="text-5xl font-bold tracking-tight">{entry.name}</h1>
                        {entry.comment && <p className='text-lg text-muted-foreground'>{entry.comment}</p>}
                        <p className='text-base font-medium text-muted-foreground uppercase'>{format(entry.created_at, 'MM/d/yyyy, h:mm a')}</p>
                    </div>
                    <div className='w-full flex flex-row items-center justify-start gap-4'>
                        {nutritionFacts && (
                            <NutritionFactsDialog
                                nutritionFacts={nutritionFacts}
                                totalWeight={totalWeight}
                            />
                        )}
                        <TextSummaryDialog text={textDescription} />
                    </div>
                    <div>
                        <div className='mb-2 flex flex-row items-center justify-between'>
                            <h2 className="text-xl font-semibold">Predictions</h2>
                            {hasIncompletePredictions && (
                                <Badge variant='destructive' className='text-xs'>INCOMPLETE</Badge>
                            )}
                        </div>
                        <div className='w-full flex flex-col items-stretch justify-start gap-4'>
                            {allPredictions.map((prediction, index) => (
                                <PredictionCard key={index} prediction={prediction} />
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <ScrollArea className="w-full rounded-md">
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
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}

