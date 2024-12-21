import { ScanBarcode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NutritionFacts from '@/components/nutrition-facts';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { USDAFood } from '@/types';

type NutritionFactsDialogProps = {
    nutritionFacts: USDAFood;
    totalWeight: number;
    servingName?: string;
    servingAmount?: number;
}

export default function NutritionFactsDialog({ nutritionFacts, totalWeight, servingName = 'meal', servingAmount = 1 }: NutritionFactsDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='outline'>
                    <ScanBarcode className='size-4' />
                    Nutrition Facts
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Nutrition Facts</DialogTitle>
                <NutritionFacts
                    servingSize={`${servingAmount} ${servingName} (${totalWeight}g)`}
                    calories={nutritionFacts.kcal ?? 0}
                    totalFat={nutritionFacts.fat ?? 0}
                    saturatedFat={nutritionFacts.fat_sat ?? 0}
                    transFat={nutritionFacts.fat_trans ?? 0}
                    protein={nutritionFacts.protein ?? 0}
                    totalCarbohydrate={nutritionFacts.carbs ?? 0}
                    dietaryFiber={nutritionFacts.fiber}
                    totalSugars={nutritionFacts.sugar}
                    addedSugars={nutritionFacts.sugar_added}
                    sodium={nutritionFacts.sodium} />
            </DialogContent>
        </Dialog>
    );
}