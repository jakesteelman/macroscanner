// api/v1/predict/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { uploadPhotos } from "@/app/(app)/_actions/photos";
import { createBlankEntry } from "@/app/(app)/_actions/entries";
import { predict } from "@/app/(app)/_actions/predict";
import { PredictRequest, PredictResponse } from "@/lib/types/predict";
import { createPredictions } from "@/app/(app)/_actions/predictions";

export async function POST(request: Request) {
    const supabase = await createClient();

    try {
        const { images, name, comment } = await request.json() as PredictRequest;

        // Authenticate user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json<PredictResponse>(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        let entry;
        const entryName = name ?? `Entry ${new Date().toLocaleString()}`;
        try {
            entry = await createBlankEntry({
                user_id: user.id,
                name: entryName,
                comment: comment
            });
        } catch (error) {
            console.error('Error creating blank entry:', error);
            throw error;
        }

        let processedPhotos;
        try {
            processedPhotos = await uploadPhotos({
                images,
                entryId: entry.id
            });
        } catch (error) {
            console.error('Error uploading photos:', error);
            throw error;
        }

        let result;
        try {
            result = await predict({
                images: processedPhotos.map(photo => photo.base64),
                comment
            });
        } catch (error) {
            console.error('Error predicting:', error);
            throw error;
        }

        let createdPredictions;
        try {
            const predictions = result.predictions;
            createdPredictions = await createPredictions(
                predictions.map(prediction => ({
                    name: prediction.name,
                    unit: prediction.unit,
                    quantity: prediction.amount,
                    photo_id: processedPhotos[prediction.photoIndex].id
                }))
            );
        } catch (error) {
            console.error('Error creating predictions:', error);
            throw error;
        }

        return NextResponse.json<PredictResponse>({
            success: true,
            result: {
                id: entry.id,
                name: entryName,
                photos: processedPhotos.map((photo, index) => ({
                    id: photo.id,
                    url: photo.photo_url,
                    name: `${photo.id}.jpg`,
                    predictions: result.predictions.filter(prediction => prediction.photoIndex === index).map(prediction => ({
                        name: prediction.name,
                        amount: prediction.amount,
                        unit: prediction.unit,
                    }))
                }))
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json<PredictResponse>(
            { success: false, error: "Failed to process upload" },
            { status: 500 }
        );
    }
}
