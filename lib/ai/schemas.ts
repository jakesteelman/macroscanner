import { z } from "zod";

export const PredictionSchema = z.object({
    predictions: z.array(
        z.object({
            photoIndex: z
                .number()
                .describe('Index of the photo in the array of photos uploaded that this prediction belongs to.'),
            name: z
                .string()
                .describe('Name of the food predicted, along with any comma-separated attributes that would affect the nutritional information, i.e. raw/cooked/etc, boneless/bone-in, etc.'),
            unit: z
                .string()
                .describe('Unit of measurement for the amount. Can be in standard units (grams, milliliters, oz, fl oz, etc), common household measurements (cups, tablespoons, etc.), or item-specific measurements (slices, pieces, etc.). Choose the most logical measurement.'),
            amount: z
                .number()
                .describe('Numeric amount of food predicted in terms of whatever the unit is.'),
        })
            .describe('Prediction for a single food item in this photo'))
})
    .describe('Prediction schema for a single photo, including all food items detected and their nutritional information');

export const USDAChosenItemSchema = z.object({
    name: z
        .string()
        .describe('Name of the chosen food item.'),
    fdcId: z
        .number()
        .describe('USDA FoodData Central ID of the chosen food item.'),
})
    .describe('Schema for the chosen USDA FoodData Central ID for a food item.');