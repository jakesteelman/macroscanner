"use server"
import { Database, TablesInsert, TablesUpdate } from "@/types/database.types"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "./user"
import { revalidatePath } from "next/cache"

export async function createPredictions(prediction: TablesInsert<'predictions'>[]) {
    const supabase = await createClient()
    const user = await getUser()

    const { data, error } = await supabase
        .from('predictions')
        .insert(prediction)
        .select();

    if (error) throw error

    return data
}

export async function markPredictionAsCorrect(id: string) {
    const supabase = await createClient()
    const user = await getUser()

    const { data, error } = await supabase
        .from('predictions')
        .update({ is_correct: true })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error

    return data
}


/**
 * Object representing which, if any, corrections the user can make to a prediction
 */
type PredictionCorrections = {
    /** Corrected name of the food item */
    name?: string,
    /** Corrected amount of the food item */
    amount?: number,
    /** Corrected unit of measurement for the amount */
    unit?: string,
    /** Corrected USDA FoodData Central ID for the food item */
    fdc_id?: number,
}

/**
 * 
 * @param id ID of the prediction to mark as incorrect
 * @param corrections User-supplied corrections to the prediction
 * @returns 
 */
export async function markPredictionIncorrect(id: string, corrections: PredictionCorrections) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('predictions')
        .update({
            is_correct: false,
            corrected_name: corrections.name,
            corrected_quantity: corrections.amount,
            corrected_unit: corrections.unit,
            corrected_fdc_id: corrections.fdc_id,
            corrected_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

    if (error) throw error

    return data
}

/**
 * Parameters to link a prediction to a USDA food item
 */
interface LinkPredictionParams {
    /** ID of the prediction to link */
    prediction_id: string,
    /** FDC ID of the USDA food item to link to */
    fdc_id: number,
}

/**
 * Link a prediction to a USDA food item
 * 
 * @param params Parameters to link a prediction to a USDA food item
 * @returns 
 */
export async function linkPredictionToUSDAFood({ prediction_id, fdc_id }: LinkPredictionParams) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('predictions')
        .update({ corrected_fdc_id: fdc_id })
        .eq('id', prediction_id)
        .select();

    if (error) throw error

    revalidatePath(`/entries/${prediction_id}`)

    return data
}