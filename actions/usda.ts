"use server";

import { Tables } from "@/types/database.types";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

/**
 * Parameters to search for USDA foods.
 * 
 * One of `query_text` or `query_embedding` is required,
 * otherwise the function will throw an error.
 */
interface SearchUSDAFoodsParams {
    /** Text to search for */
    query_text?: string;
    /** Embedding to search for */
    query_embedding?: number[];
    /** 
     * Match threshold for similarity score.
     * Defaults to 0.5.
     * Similarities below this score will not be returned.
     */
    match_threshold?: number;
    /**
     * Number of results to return.
     * Defaults to 5.
     */
    match_count?: number;
}

/**
 * Result of searching for USDA foods.
 */
type SearchUSDAFoodsResult = {
    matches: {
        /** FDC ID of the food item */
        fdc_id: number;
        /** Name of the food item */
        name: string;
        /** Similarity score of the food item to the searched item. */
        similarity: number;
    }[]
    embedding_usage: {
        prompt_tokens: number;
        total_tokens: number;
    }
}

/**
 * Search for foods in the USDA Food Data Central database.
 * 
 * @param params Parameters to search for USDA foods.
 * @returns Result of searching for USDA foods.
 */
export const searchUSDAFoods = async ({
    query_text,
    query_embedding,
    match_threshold = 0.5,
    match_count = 5
}: SearchUSDAFoodsParams): Promise<SearchUSDAFoodsResult> => {

    const supabase = await createClient();
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    if (!query_text && !query_embedding) {
        throw new Error("Need either query_text or query_embedding");
    }

    let embedding = query_embedding;
    let usage: {
        prompt_tokens: number,
        total_tokens: number
    } = {
        prompt_tokens: 0,
        total_tokens: 0
    }

    if (query_text && !query_embedding) {
        const { data: embeddingData, usage: embeddingUsage } = await openai.embeddings.create({
            dimensions: 1536,
            model: 'text-embedding-3-small',
            input: query_text
        })

        embedding = embeddingData[0].embedding;
        usage = {
            prompt_tokens: embeddingUsage.prompt_tokens,
            total_tokens: embeddingUsage.total_tokens,
        }
    }

    const { data: searchResults, error: searchError } = await supabase.rpc('search_usda_foods', {
        query_embedding: JSON.stringify(embedding),
        match_count,
        match_threshold,
    })

    // TODO: Function should return usage data as well.
    return {
        matches: searchResults || [],
        embedding_usage: {
            prompt_tokens: usage.prompt_tokens,
            total_tokens: usage.total_tokens
        }
    };
}

/**
 * Parameters for getting a full USDA food item.
 */
interface GetUSDAFoodParams {
    /** FDC ID of the food item */
    fdcId: number;
}

/**
 * Get Food Item
 * 
 * Get a full USDA food item by its FDC ID.
 * 
 * @param params Parameters for getting a full USDA food item.
 * @returns A full USDA food item.
 */
export const getFoodItem = async ({ fdcId }: GetUSDAFoodParams): Promise<Tables<'usda_foods'>> => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('usda_foods')
        .select('*')
        .eq('fdc_id', fdcId)
        .single();

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Parameters for paginated search of USDA foods.
 */
interface SearchUSDAFoodsPaginatedParams {
    query: string;
    page?: number;
    limit?: number;
}

/**
 * Paginated search for USDA foods. Full Text Search.
 * 
 * @param params Parameters for paginated search of USDA foods.
 * @returns Paginated search results of USDA foods.
 */
export const searchUSDAFoodsPaginated = async ({
    query,
    page = 1,
    limit = 10
}: SearchUSDAFoodsPaginatedParams) => {
    const supabase = await createClient();
    const start = (page - 1) * limit;

    const ftsQuery = query.trim().split(/\s+/).join(' & ').toLowerCase();

    const { data, error, count } = await supabase
        .from('usda_foods')
        .select('*', { count: 'exact' })
        // .textSearch('fts', `'${ftsQuery}'`)
        .filter('fts', 'fts', ftsQuery)
        .neq('data_type', 'sub_sample_food')
        .range(start, start + limit - 1)
        .order('name');

    if (error) {
        throw error;
    }

    return {
        foods: data,
        total: count || 0,
        page,
        limit
    };
};