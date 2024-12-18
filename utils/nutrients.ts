import { FoodNutrient, NutrientId, NutrientKey } from "@/lib/types/usda.types"

export const FDC_MACRONUTRIENTS = {
    "208": "Energy (kcal)",
    "204": "Total Fat (g)",
    "606": "Saturated Fatty Acids (g)",
    "605": "Trans Fatty Acids (g)",
    "601": "Cholesterol (mg)",
    "307": "Sodium (mg)",
    "205": "Carbohydrate (g)",
    "291": "Dietary Fiber (g)",
    "269": "Total Sugars (g)",
    "203": "Protein (g)",
    "221": "Alcohol, ethyl (g)",
    "255": "Water (g)",
    "262": "Caffeine (mg)",
}

export type NutrientMeasure = {
    quantity: number,
    unit: string
};

export type NutrientProfile = {
    [key in NutrientKey]: NutrientMeasure
};

/**
 * Builds a nutrition profile that's easier to work with
 * 
 * @param nutrients List of FoodNutrients from USDA FDC API
 * @returns A profile of the quantities of nutrients in the food.
 */
export const buildNutrientProfile = (nutrients: FoodNutrient[]): NutrientProfile => {

    const nutrientIdToKey: Record<NutrientId, NutrientKey> = {
        208: "energy",
        204: "fat",
        606: "saturatedFat",
        605: "transFat",
        601: "cholesterol",
        307: "sodium",
        205: "carbohydrate",
        291: "fiber",
        269: "sugars",
        203: "protein",
        221: "alcohol",
        255: "water",
        262: "caffeine",
    };

    const profile = Object.fromEntries(
        Object.values(nutrientIdToKey).map((key) => [key, { quantity: 0, unit: "" }])
    ) as NutrientProfile;

    nutrients.forEach((nutrient) => {
        const key = nutrientIdToKey[nutrient.nutrientId as NutrientId];
        if (key) {
            profile[key] = {
                quantity: nutrient.value,
                unit: nutrient.unitName,
            };
        }
    });

    return profile;
}
