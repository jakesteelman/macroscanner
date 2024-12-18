import { Tables } from '@/types/database.types';
import { serving } from '@/lib/utils/conversion';
import MacroPieChart from './MacroPieChart';

type Props = {
    prediction: Tables<'predictions'> & {
        usda_foods?: Omit<Tables<'usda_foods'>, 'embedding'> | null
    }
}

const PredictionCardNutrition = ({ prediction }: Props) => {
    // all of this logic assumes grams as the unit. This will need to be updated to support other mass units, as well as volume.
    if (!prediction.usda_foods) return null

    const { kcal, fat, carbs, protein } = serving(prediction.usda_foods, {
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
            <MacroPieChart size={32} thickness={7} fat={fat} carb={carbs} protein={protein} />
            <div className='w-full flex flex-col items-start justify-start'>
                <span className='font-semibold -mb-0.5'>{(totalCalories || computedKcal)} kcal</span>
                <div className=' flex flex-row items-center justify-start gap-3 text-sm'>
                    <span><span className='text-orange-500  font-semibold'>Fat</span>{' '}<span>{totalFat.toFixed(0)}g</span></span>
                    <span><span className='text-green-500  font-semibold'>Carb</span>{' '}<span>{totalCarbs.toFixed(0)}g</span></span>
                    <span><span className='text-blue-500  font-semibold'>Protein</span>{' '}<span>{totalProtein.toFixed(0)}g</span></span>
                </div>
            </div>
        </div>
    )
}

export default PredictionCardNutrition