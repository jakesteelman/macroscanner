"use server";
import { FoodItem, FoodSearchResult } from '@/lib/types/usda.types';



interface SearchFoodParams {
    query: string;
    pageSize?: number;
    pageNumber?: number;
    dataType?: Array<'Foundation' | 'SR Legacy' | 'Branded' | 'Survey (FNDDS)'>;
    sortBy?: 'dataType.keyword' | 'lowercaseDescription.keyword' | 'fdcId';
    sortOrder?: 'asc' | 'desc';
}

/**
 * Search for foods in the USDA Food Data Central database
 */
export async function searchFoods({
    query,
    pageSize = 25,
    pageNumber = 1,
    dataType = ['Survey (FNDDS)'],
    sortBy = 'lowercaseDescription.keyword',
    sortOrder = 'asc'
}: SearchFoodParams): Promise<FoodSearchResult> {

    const API_ENDPOINT = process.env.USDA_API_ENDPOINT || 'https://api.nal.usda.gov/fdc/v1';
    const API_KEY = process.env.USDA_API_KEY

    try {
        const response = await fetch(`${API_ENDPOINT}/foods/search?api_key=${API_KEY as string}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query,
                pageSize,
                pageNumber,
                dataType,
            }),
        });

        if (!response.ok) {
            throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
        }

        const data: FoodSearchResult = await response.json();

        return data;
    } catch (error) {
        console.error('Error searching foods:', error);
        throw new Error('Failed to search foods');
    }
}

/**
 * Get detailed information about a specific food by its FDC ID
 */
export async function getFoodDetails(fdcId: number): Promise<FoodItem> {

    const API_ENDPOINT = process.env.USDA_API_ENDPOINT || 'https://api.nal.usda.gov/fdc/v1';
    const API_KEY = process.env.USDA_API_KEY

    try {
        const response = await fetch(`${API_ENDPOINT}/food/${fdcId}?api_key=${API_KEY as string}`, {
            headers: {
                'Api-Key': API_KEY as string,
            },
        });

        if (!response.ok) {
            throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
        }

        const data: FoodItem = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching food details:', error);
        throw new Error(`Failed to fetch food details for ID: ${fdcId}`);
    }
}

/**
 * Get nutrient information for multiple foods by their FDC IDs
 */
export async function getBulkFoodDetails(fdcIds: number[]): Promise<FoodItem[]> {

    const API_ENDPOINT = process.env.USDA_API_ENDPOINT || 'https://api.nal.usda.gov/fdc/v1';
    const API_KEY = process.env.USDA_API_KEY

    try {
        const response = await fetch(`${API_ENDPOINT}/foods?api_key=${API_KEY as string}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': API_KEY as string,
            },
            body: JSON.stringify({
                fdcIds,
                format: 'full'
            }),
        });

        if (!response.ok) {
            throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
        }

        const data: FoodItem[] = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching bulk food details:', error);
        throw new Error('Failed to fetch bulk food details');
    }
}