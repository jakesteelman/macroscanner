import { Tables } from '@/types/database.types';
import convert, { Unit } from 'convert';
import type { USDAFood } from '@/types';

// Predefine supported units for mass and volume that `convert` can handle.
const MASS_UNITS = ['g', 'grams', 'gram', 'kg', 'kilograms', 'kilogram', 'oz', 'ounce', 'ounces', 'lb', 'pound', 'pounds'];
export const VOLUME_UNITS = [
    'ml', 'milliliter', 'milliliters',
    'l', 'liter', 'liters', 'litre', 'litres',
    'tsp', 'teaspoon', 'teaspoons',
    'tbsp', 'tablespoon', 'tablespoons',
    'fl-oz', 'fl oz', 'floz', 'fluid ounce', 'fluid ounces', 'fl ounce', 'fl ounces',
    'cup', 'cups', 'pint', 'pints', 'quart', 'quarts', 'gallon', 'gallons'
];

function convertToGrams(quantity: number, unit: string, density?: number | null): number {
    const unitLower = unit.toLowerCase();

    if (MASS_UNITS.includes(unitLower)) {
        return convert(quantity, unitLower as Unit).to('g');
    }

    if (VOLUME_UNITS.includes(unitLower)) {
        if (!density) {
            throw new Error('Density is required to convert volume to mass');
        }
        // Convert volume units to milliliters
        const volumeInMl = convert(quantity, unitLower as Unit).to('ml');
        // Convert ml to grams using density
        return volumeInMl * density;
    }

    // If the unit is neither recognized mass nor volume, throw an error
    throw new Error(`Unsupported unit: ${unit}`);
}


type ServingProps = {
    quantity: number;
    unit: string;
}

export function serving(usdaFood: USDAFood, { quantity, unit }: ServingProps): USDAFood {
    const massInGrams = convertToGrams(quantity, unit, usdaFood.density);
    const scaleFactor = massInGrams / 100;

    return {
        ...usdaFood,
        kcal: (usdaFood.kcal ?? 0) * scaleFactor,
        fat: (usdaFood.fat ?? 0) * scaleFactor,
        fat_sat: (usdaFood.fat_sat ?? 0) * scaleFactor,
        fat_mono: (usdaFood.fat_mono ?? 0) * scaleFactor,
        fat_poly: (usdaFood.fat_poly ?? 0) * scaleFactor,
        fat_trans: (usdaFood.fat_trans ?? 0) * scaleFactor,
        cholesterol: (usdaFood.cholesterol ?? 0) * scaleFactor,
        sodium: (usdaFood.sodium ?? 0) * scaleFactor,
        carbs: (usdaFood.carbs ?? 0) * scaleFactor,
        fiber: (usdaFood.fiber ?? 0) * scaleFactor,
        sugar: (usdaFood.sugar ?? 0) * scaleFactor,
        sugar_added: (usdaFood.sugar_added ?? 0) * scaleFactor,
        protein: (usdaFood.protein ?? 0) * scaleFactor,
        alcohol: (usdaFood.alcohol ?? 0) * scaleFactor,
        caffeine: (usdaFood.caffeine ?? 0) * scaleFactor,
    };
}

type MealProps = {
    items: {
        usdaFood: USDAFood,
        quantity: number;
        unit: string
    }[]
}

type NumericKeys = {
    [K in keyof USDAFood]: NonNullable<USDAFood[K]> extends number ? K : never
}[keyof USDAFood];

const EXCLUDED_KEYS: (keyof USDAFood)[] = [
    'fdc_id', 'name', 'data_type', 'created_at', 'updated_at', 'density',
];

export function meal({ items }: MealProps): { nutritionFacts: USDAFood, totalWeight: number } {
    const totalWeight = items.reduce((sum, { usdaFood, quantity, unit }) => {
        return sum + convertToGrams(quantity, unit, usdaFood.density);
    }, 0);

    const result = items
        .map(({ usdaFood, quantity, unit }) => serving(usdaFood, { quantity, unit }))
        .reduce((acc: USDAFood, obj: USDAFood) => {
            for (const key in obj) {
                const keyTyped = key as NumericKeys;
                if (typeof obj[keyTyped] === 'number' && !EXCLUDED_KEYS.includes(keyTyped)) {
                    acc[keyTyped] = (acc[keyTyped] ?? 0) + (obj[keyTyped] ?? 0);
                }
            }
            return acc;
        }, {} as USDAFood);

    // Round all numeric values
    for (const key in result) {
        const keyTyped = key as NumericKeys;
        if (typeof result[keyTyped] === 'number' && !EXCLUDED_KEYS.includes(keyTyped)) {
            result[keyTyped] = Math.round(result[keyTyped] as number);
        }
    }

    return {
        nutritionFacts: result,
        totalWeight: Math.round(totalWeight)
    };
}