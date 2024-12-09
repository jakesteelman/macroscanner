
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
    result?: {
        /** ID of the created journal entry in the database */
        id?: string;
        /** Name of the meal (generated server side unless supplied by user) */
        name: string;
        /** Array of photos attached to the meal. */
        photos: Array<{
            /** ID of the record in the database. Also the filename. */
            id?: string;
            /** URL (except host) where the photo is in Supabase Storage */
            url: string;
            /** Name of the photo, which is same as the ID except has the extension attached. */
            name: string;
            /** Array of predictions for food items in this photo */
            predictions: Array<{
                /** Identifier for this prediction in the database. */
                id?: string;
                /** Name of the food predicted */
                name: string;
                /** Numeric amount of food predicted */
                amount: number;
                /** Unit of measurement for the amount */
                unit: string;
                /** USDA FoodData Central ID for the food item */
                fdc_id?: number;
            }>;
        }>;
    };
}