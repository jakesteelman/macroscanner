import React from 'react';

interface NutritionFactsProps {
    servingSize: string;
    calories: number;
    totalFat?: number | null;
    saturatedFat?: number | null;
    transFat?: number | null;
    cholesterol?: number | null;
    sodium?: number | null;
    totalCarbohydrate?: number | null;
    dietaryFiber?: number | null;
    totalSugars?: number | null;
    addedSugars?: number | null;
    protein: number;
    vitaminD?: number | null;
    calcium?: number | null;
    iron?: number | null;
    potassium?: number | null;
}

const NutritionFacts: React.FC<NutritionFactsProps> = ({
    servingSize,
    calories,
    totalFat,
    saturatedFat,
    transFat,
    cholesterol,
    sodium,
    totalCarbohydrate,
    dietaryFiber,
    totalSugars,
    addedSugars,
    protein,
    vitaminD,
    calcium,
    iron,
    potassium,

}) => {
    return (
        <div className="w-full max-w-sm mx-auto bg-background p-4 border-2 border-foreground font-sans">
            <h2 className="text-3xl font-bold mb-1 text-left">Nutrition Facts</h2>
            <div className="border-b-8 border-foreground mb-1"></div>
            <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-xl font-bold">Serving size</h3>
                <span className="text-xl font-bold">{servingSize}</span>
            </div>
            <div className="border-b-4 border-foreground my-1"></div>
            <div className="text-sm">
                <div className="flex justify-between items-baseline font-bold">
                    <h3 className="text-lg">Calories</h3>
                    <span className="text-3xl">{calories}</span>
                </div>
                <div className="border-b border-foreground my-1"></div>
                <div className="flex justify-end text-xs mb-1">% Daily Value*</div>
                {totalFat !== undefined && totalFat !== null && <NutritionItem name="Total Fat" value={totalFat} unit="g" />}
                {saturatedFat !== undefined && saturatedFat !== null && <NutritionItem name="Saturated Fat" value={saturatedFat} unit="g" indented />}
                {transFat !== undefined && transFat !== null && <NutritionItem name="Trans Fat" value={transFat} unit="g" indented />}
                {cholesterol !== undefined && cholesterol !== null && <NutritionItem name="Cholesterol" value={cholesterol} unit="mg" />}
                {sodium !== undefined && sodium !== null && <NutritionItem name="Sodium" value={sodium} unit="mg" />}
                {totalCarbohydrate !== undefined && totalCarbohydrate !== null && <NutritionItem name="Total Carbohydrate" value={totalCarbohydrate} unit="g" />}
                {dietaryFiber !== undefined && dietaryFiber !== null && <NutritionItem name="Dietary Fiber" value={dietaryFiber} unit="g" indented />}
                {totalSugars !== undefined && totalSugars !== null && <NutritionItem name="Total Sugars" value={totalSugars} unit="g" indented />}
                {addedSugars !== undefined && addedSugars !== null && <NutritionItem name="Added Sugars" value={addedSugars} unit="g" indented />}
                <NutritionItem name="Protein" value={protein} unit="g" />
                <div className="border-b-4 border-foreground my-1"></div>
                {vitaminD !== undefined && vitaminD !== null && <NutritionItem name="Vitamin D" value={vitaminD} unit="mcg" />}
                {calcium !== undefined && calcium !== null && <NutritionItem name="Calcium" value={calcium} unit="mg" />}
                {iron !== undefined && iron !== null && <NutritionItem name="Iron" value={iron} unit="mg" />}
                {potassium !== undefined && potassium !== null && <NutritionItem name="Potassium" value={potassium} unit="mg" />}
                <div className="border-t border-foreground mt-1 pt-1 text-xs">
                    * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
                </div>
            </div>
        </div>
    );
};

interface NutritionItemProps {
    name: string;
    value: number;
    unit: string;
    indented?: boolean;
}

const NutritionItem: React.FC<NutritionItemProps> = ({ name, value, unit, indented = false }) => {
    const dailyValue = calculateDailyValue(name, value);
    return (
        <div className={`flex justify-between ${indented ? 'pl-4' : ''} border-t border-foreground`}>
            <span>{name} {value}{unit}</span>
            {dailyValue && <span className="font-bold">{dailyValue}%</span>}
        </div>
    );
};

function calculateDailyValue(name: string, value: number): number | null {
    // This is a simplified calculation. In a real app, you'd want to use more accurate values and calculations.
    const dailyValues: { [key: string]: number } = {
        'Total Fat': 78,
        'Saturated Fat': 20,
        'Cholesterol': 300,
        'Sodium': 2300,
        'Total Carbohydrate': 275,
        'Dietary Fiber': 28,
        'Vitamin D': 20,
        'Calcium': 1300,
        'Iron': 18,
        'Potassium': 4700,
    };

    if (name in dailyValues) {
        return Math.round((value / dailyValues[name]) * 100);
    }
    return null;
}

export default NutritionFacts;

