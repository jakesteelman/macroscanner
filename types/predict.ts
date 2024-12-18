import { Tables } from "@/types/database.types";

export interface PredictRequest {
    /** Array of base64 strings representing the uploaded photos */
    images: Array<string>; // base64 encoded images created by calling URL.createObjectURL(file) from a JS frontend
    /** Optional name of the meal. */
    name?: string;
    /** Optional user-supplied comment about the meal or entry in general. */
    comment?: string;
    /** Optional ID of an existing journal entry to attach the photos to. */
    entryId?: string;
}

export interface PredictResponse {
    /** Whether or not the prediction was successful. */
    success: boolean;
    /** If unsuccessful, the error encountered. */
    error?: string;
    /** If successful, the prediction result. */
    result?: Tables<'entries'> & {
        photos: (Tables<'photos'> & {
            predictions: (Tables<'predictions'> & {
                usda_foods?: Omit<Tables<'usda_foods'>, "embedding"> | null
            })[];
        })[];
    };
}