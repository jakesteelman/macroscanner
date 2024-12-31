import { serving } from '@/lib/utils/conversion';
import { PredictionWithUSDA } from '@/types';

type Props = {
    prediction: PredictionWithUSDA
}

const PredictionCardNutrition = ({ prediction }: Props) => {
    // all of this logic assumes grams as the unit. This will need to be updated to support other mass units, as well as volume.
    const usdaFood = prediction.corrected_usda_food ?? prediction.usda_food
    if (!usdaFood) return null;

    const { kcal, fat, carbs, protein } = serving(usdaFood, {
        quantity: prediction.corrected_quantity || prediction.quantity,
        unit: prediction.corrected_unit || prediction.unit
    })

    const totalFat = fat || 0
    const totalCarbs = carbs || 0
    const totalProtein = protein || 0

    const fatCalories = totalFat * 9
    const carbCalories = totalCarbs * 4
    const proteinCalories = totalProtein * 4

    const computedKcal = Math.round(fatCalories + carbCalories + proteinCalories)
    const totalCalories = Math.round(kcal || computedKcal)

    return (
        <div className='w-full flex flex-row items-center justify-start gap-2'>
            <span className='font-semibold'>{(totalCalories || computedKcal)} kcal</span>
            <span><span className='text-chart-1 font-semibold'>Protein</span>{' '}<span>{totalProtein.toFixed(0)}g</span></span>
            <span><span className='text-chart-2 font-semibold'>Fat</span>{' '}<span>{totalFat.toFixed(0)}g</span></span>
            <span><span className='text-chart-3 font-semibold'>Carb</span>{' '}<span>{totalCarbs.toFixed(0)}g</span></span>
        </div>
    )
}

export default PredictionCardNutrition