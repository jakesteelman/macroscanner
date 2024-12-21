"use client";
import { Tables } from '@/types/database.types'
import React, { useCallback, useState } from 'react'
import { Button } from './ui/button'
import { AlertOctagonIcon, LinkIcon, ThumbsDown, ThumbsUp } from 'lucide-react'
import { markPredictionAsCorrect, markPredictionIncorrect } from '@/actions/predictions';
import { toast } from 'sonner';

import { Input } from './ui/input';
import PredictionCardNutrition from './prediction-nutrition';
import { cn } from '@/lib/utils';
import { PredictionWithUSDA } from '@/types';
import { Badge } from './ui/badge';
import ManualLinkingDialog from './dialogs/manual-usda-link-dialog';

type Props = {
    prediction: PredictionWithUSDA
}

const PredictionCard = ({ prediction }: Props) => {

    const [pendingFeedback, setPendingFeedback] = useState<"correct" | "incorrect" | undefined>()
    const [corrections, setCorrections] = useState({
        name: prediction.name,
        quantity: prediction.quantity.toString(),
        unit: prediction.unit,
    })

    const handleMarkAsCorrect = useCallback(
        async () => {
            setPendingFeedback('correct')
            try {
                await markPredictionAsCorrect(prediction.id)

                toast.success('Marked correct', {
                    description: "Thanks for helping us improve our predictions!",
                })
            } catch (error) {
                toast.error('An error occurred', {
                    description: <pre>{JSON.stringify(error, null, 2)}</pre>
                })
            } finally {
                setPendingFeedback(undefined)
            }
        },
        [prediction.id])

    const handleMarkAsIncorrect = useCallback(
        () => setPendingFeedback('incorrect'),
        [])

    const handleCorrectPrediction = useCallback(
        async () => {
            const hasChanges =
                corrections.name !== prediction.name ||
                corrections.quantity !== prediction.quantity.toString() ||
                corrections.unit !== prediction.unit;

            if (!hasChanges) {
                return toast.error('No changes made');
            }

            const updates = {
                name: corrections.name !== prediction.name ? corrections.name : undefined,
                amount: corrections.quantity !== prediction.quantity.toString()
                    ? parseFloat(corrections.quantity)
                    : undefined,
                unit: corrections.unit !== prediction.unit ? corrections.unit : undefined
            };

            if (updates.amount !== undefined && isNaN(updates.amount)) {
                return toast.error('Quantity must be a number');
            }

            await markPredictionIncorrect(prediction.id, updates);
        },
        [corrections, prediction])

    return (
        <div className="p-4 rounded-lg border w-full flex flex-col gap-2">
            <div className='flex flex-row items-center justify-between gap-2'>
                <div className='flex flex-row items-center justify-start gap-2'>
                    <h3 className="text-lg font-semibold capitalize flex gap-2 items-center justify-start">
                        <span>
                            {prediction.corrected_quantity ?? prediction.quantity} <span className='lowercase'>{prediction.corrected_unit ?? prediction.unit}</span>{' '}
                            {prediction.corrected_name ?? prediction.name}
                        </span>
                        {prediction.is_correct !== null && prediction.is_correct === false && (
                            <Badge variant='outline' className='flex-none'>CORRECTED</Badge>
                        )}
                    </h3>
                </div>
                <div className='flex flex-row items-center justify-start gap-2'>
                    <Button
                        size='icon'
                        variant='ghost'
                        className={cn(
                            'size-8',
                            (pendingFeedback === 'correct' || prediction.is_correct) && 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400',
                        )}
                        onClick={handleMarkAsCorrect}
                    >
                        <ThumbsUp className='size-4' />
                    </Button>
                    <Button
                        variant='ghost'
                        size='icon'
                        className={cn(
                            'size-8',
                            (pendingFeedback === 'incorrect' || prediction.is_correct === false) && 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400',
                        )}
                        onClick={handleMarkAsIncorrect}
                    >
                        <ThumbsDown className='size-4' />
                    </Button>
                </div>
            </div>
            <div>
                {prediction.usda_foods ? (
                    <p className='text-sm text-muted-foreground'>
                        USDA: {prediction.usda_foods.name}
                    </p>
                ) : (
                    <p className='text-sm text-muted-foreground flex flex-row items-center justify-start gap-2'>
                        <AlertOctagonIcon className='size-4 text-destructive' /><span className='text-destructive'>{' '}No USDA match found!{' '}</span>
                        <ManualLinkingDialog prediction={prediction}><Button variant='link' size='sm' className='p-0 text-foreground'>Link manually</Button></ManualLinkingDialog>
                    </p>
                )}
            </div>
            <PredictionCardNutrition prediction={prediction} />
            {pendingFeedback === 'incorrect' && (
                <div className='flex flex-col items-stretch justify-start gap-2'>
                    <h4 className='font-semibold'>
                        Correct this prediction
                    </h4>
                    <div className='grid gap-4 grid-cols-[1fr,1fr,1fr,1fr,min-content]' >
                        <Input
                            type="text"
                            placeholder="Correct name"
                            className='col-span-2 w-full'
                            defaultValue={corrections.name}
                            onChange={(e) => setCorrections({ ...corrections, name: e.target.value })}
                        />
                        <Input
                            type="text"
                            placeholder="Correct quantity"
                            className='col-span-1 w-full'
                            defaultValue={corrections.quantity}
                            onChange={(e) => setCorrections({ ...corrections, quantity: e.target.value })}
                        />
                        <Input
                            type="text"
                            placeholder="Correct unit"
                            className='col-span-1 w-full'
                            defaultValue={corrections.unit}
                            onChange={(e) => setCorrections({ ...corrections, unit: e.target.value })}
                        />
                        <Button size='sm' className='h-full w-20' onClick={handleCorrectPrediction}>Save</Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PredictionCard