import { Suspense } from 'react';
import { getEntry } from '../../../../actions/entries';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import SupabaseImage from '@/components/supabase-image';
import { Skeleton } from '@/components/ui/skeleton';
import { InfoIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import PredictionCard from '@/components/prediction-card';
import { CopyToClipboard } from '@/components/copy-to-clipboard';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import NutritionFacts from '@/components/nutrition-facts';
import { meal } from '@/lib/utils/conversion';
import { format } from 'date-fns';

export default async function Page({ params }: Readonly<{ params: Promise<{ id: string }> }>) {

    const { id } = await params;

    return (
        <div className="container mx-auto p-4">
            <Suspense fallback={<div>Loading entry details...</div>}>
                <EntryDetails id={id} />
            </Suspense>
        </div>
    )
}

async function EntryDetails({ id }: { id: string }) {
    const entry = await getEntry(id)

    const allPredictions = entry.photos.map(photo => photo.predictions).flat()
    const textDescription = allPredictions.map(prediction => {
        return `${prediction.corrected_quantity ?? prediction.quantity} ${prediction.corrected_unit ?? prediction.unit} ${prediction.corrected_name ?? prediction.name}`
    }).join(',\n')

    const { nutritionFacts, totalWeight } = meal({
        items: allPredictions.map(prediction => prediction.usda_foods && ({
            usdaFood: prediction.usda_foods,
            quantity: prediction.corrected_quantity ?? prediction.quantity,
            unit: prediction.corrected_unit ?? prediction.unit
        })).filter(item => !!item)
    })

    // TODO: FEAT - make an interactive portion selector that lets users specify how much proportion of the food they ate and then scale all the ingredients and nutrition facts down

    return (
        <div className="space-y-8">
            <div className='w-full grid grid-cols-4 gap-2'>
                <div className='col-span-3 flex flex-col'>
                    <p className='text-base font-medium mb-2 text-muted-foreground'>{format(entry.created_at, 'MMM dd, yyyy | h:mm a')}</p>
                    <h1 className="text-4xl font-bold mb-4">{entry.name}</h1>
                    {entry.comment && <p>{entry.comment}</p>}
                </div>
            </div>
            <div>
                <ScrollArea className="w-full rounded-md">
                    <div className="flex flex-row items-center justify-start gap-4">
                        {entry.photos.map((photo, index) => (
                            <div key={index} className="relative group h-56 w-auto flex-shrink-0">
                                <Suspense key={photo.id} fallback={<Skeleton className='h-56 aspect-square' />}>
                                    <SupabaseImage
                                        path={photo.photo_url}
                                        alt={`Food image ${index + 1}`}
                                        width={300}
                                        height={300}
                                        className="relative w-auto h-56 rounded-md object-cover"
                                    />
                                </Suspense>
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation='horizontal' />
                </ScrollArea>
            </div>
            <div>
                <h2 className="text-xl font-semibold">Predictions</h2>
                <div className='w-full flex flex-col items-stretch justify-start gap-4'>
                    {allPredictions.map((prediction, index) => (
                        <PredictionCard key={index} prediction={prediction} />
                    ))}
                </div>
            </div>
            <div className='w-full grid grid-cols-3 gap-4'>
                <div className='col-span-2'>
                    <div className='w-full flex flex-row items-center justify-between mb-2'>
                        <div className='w-full flex flex-row items-center justify-start gap-1'>
                            <h2 className="text-xl font-semibold">Text Summary</h2>
                            <Tooltip>
                                <TooltipTrigger>
                                    <InfoIcon className='size-4' />
                                </TooltipTrigger>
                                <TooltipContent className='max-w-sm text-center'>
                                    <p>
                                        Copy and paste this text description into Notes, or use Macrofactor's AI Describe to log it in Macrofactor.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <CopyToClipboard content={textDescription} />
                    </div>
                    <Textarea value={textDescription} readOnly rows={10} />
                </div>
                {nutritionFacts && <div>
                    {/* TODO: FEAT - Make it downloadable
                also make sure to watermark it somewhere and add a disclaimer. */}
                    <NutritionFacts
                        servingSize={`1 meal (${totalWeight}g)`}
                        calories={nutritionFacts.kcal ?? 0}
                        totalFat={nutritionFacts.fat ?? 0}
                        saturatedFat={nutritionFacts.fat_sat ?? 0}
                        transFat={nutritionFacts.fat_trans ?? 0}
                        protein={nutritionFacts.protein ?? 0}
                        totalCarbohydrate={nutritionFacts.carbs ?? 0}
                        dietaryFiber={nutritionFacts.fiber}
                        totalSugars={nutritionFacts.sugar}
                        addedSugars={nutritionFacts.sugar_added}
                        sodium={nutritionFacts.sodium}
                    />
                </div>}
            </div>
        </div>
    )
}
