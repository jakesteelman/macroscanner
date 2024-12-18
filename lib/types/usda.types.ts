// usda.types.ts
export const WEIGHT_UNITS: string[] = [
    'g',
    'mg',
    'kg',
    'oz',
    'lb'
];

export const VOLUME_UNITS: string[] = [
    'ml',
    'l',
    'fl oz',
    'cup',
    'tbsp',
    'tsp'
];

export const METRIC_UNITS: { weight: string[], volume: string[] } = {
    weight: ['g', 'mg', 'kg'],
    volume: ['ml', 'l']
}
export const IMPERIAL_UNITS: { weight: string[], volume: string[] } = {
    weight: ['oz', 'lb'],
    volume: ['fl oz', 'cup', 'tbsp', 'tsp']
}

export type NutrientKey =
    | "energy"
    | "fat"
    | "saturatedFat"
    | "transFat"
    | "cholesterol"
    | "sodium"
    | "carbohydrate"
    | "fiber"
    | "sugars"
    | "protein"
    | "alcohol"
    | "water"
    | "caffeine";

export type NutrientId =
    | 208
    | 204
    | 606
    | 605
    | 601
    | 307
    | 205
    | 291
    | 269
    | 203
    | 221
    | 255
    | 262;

export interface FoodSearchResult {
    totalHits: number;
    currentPage: number;
    totalPages: number;
    foods: FoodItem[];
}

export interface FoodItem {
    fdcId: number;
    description: string;
    scientificName?: string;
    brandName?: string;
    ingredients?: string;
    servingSize?: number;
    servingSizeUnit?: string;
    foodNutrients: FoodNutrient[];
    foodMeasures?: FoodMeasure[];
}

export interface FoodNutrient {
    nutrientId: number;
    nutrientName: string;
    value: number;
    unitName: string;
}

export interface FoodMeasure {
    disseminationText: string;
    gramWeight: number;
    id: number;
    modifier: string;
    rank: number;
    measureUnitAbbreviation: string;
    measureUnitName: string;
    measureUnitId: number;
}