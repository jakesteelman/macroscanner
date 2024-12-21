import { Tables } from "@/types/database.types";

export interface PredictRequest {
    /** Array of file IDs representing the uploaded photos */
    fileIds: string[];
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
    /** If successful, the ID of the completed entry. */
    entryId?: string;
}