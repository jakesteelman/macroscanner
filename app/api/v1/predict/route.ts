// api/v1/predict/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { uploadPhotos, getUploadedPhoto } from "@/actions/photos";
import { createBlankEntry, getEntry } from "@/actions/entries";
import { chooseUSDAItem, predict } from "@/actions/predict";
import { PredictRequest, PredictResponse } from "@/types/predict";
import { createPredictions } from "@/actions/predictions";
import { TablesInsert } from "@/types/database.types";
import OpenAI from "openai";
import { searchUSDAFoods } from "@/actions/usda";

export async function POST(request: Request) {
    const supabase = await createClient();
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    try {
        const { fileIds, name, comment } = await request.json() as PredictRequest;

        // Authenticate user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json<PredictResponse>(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const entryName = name ?? `Entry ${new Date().toLocaleString()}`;

        const entry = await createBlankEntry({
            user_id: user.id,
            name: entryName,
            comment: comment
        });

        const processedPhotos = await Promise.all(
            fileIds.map(async (fileId) => {
                const photo = await getUploadedPhoto(user.id, fileId);

                // Create a record in the 'photos' table
                const { data: photoRecord, error: photoError } = await supabase
                    .from('photos')
                    .insert({
                        id: fileId, // Use the same fileId as the photo ID
                        user_id: user.id,
                        photo_url: `${user.id}/${fileId}.jpg`,
                        entry_id: entry.id
                    })
                    .select()
                    .single();

                if (photoError || !photoRecord) {
                    throw new Error('Failed to create photo record');
                }

                return {
                    id: fileId,
                    base64: photo.base64
                };
            })
        );

        const { object: result, usage: prediction_usage } = await predict({
            images: processedPhotos.map(photo => photo.base64),
            comment
        });

        console.log("Prediction Usage:", prediction_usage);

        // Embed the predictions
        const {
            data: embeddingData,
            // TODO: Handle usage data.
            usage: embeddingUsage
        } = await openai.embeddings.create({
            dimensions: 1536,
            model: 'text-embedding-3-small',
            input: result.predictions.map(({ name }) => name)
        });

        console.log("Embedding Usage:", embeddingUsage);

        const predictions = result.predictions.map((prediction, i) => ({
            ...prediction,
            embedding: embeddingData.find(({ index }) => index === i)?.embedding
        }));

        const mappedPredictions: TablesInsert<"predictions">[] = await Promise.all(
            predictions.map(async (prediction) => {
                const basePrediction: TablesInsert<'predictions'> = {
                    name: prediction.name,
                    quantity: prediction.amount,
                    unit: prediction.unit,
                    photo_id: processedPhotos[prediction.photoIndex].id,
                    fdc_id: undefined
                };

                console.debug('Searching for:', prediction.name);
                console.debug("Embedding length", prediction.embedding?.length);

                const { matches } = await searchUSDAFoods({
                    query_embedding: prediction.embedding,
                    match_count: 10,
                    match_threshold: 0.4
                });

                if (!matches) {
                    throw new Error(`Failed to find matches for ${prediction.name}`);
                }

                console.debug("Possible matches:", matches);

                switch (matches.length) {
                    case 0:
                        console.debug("No matches found for:", prediction.name);
                        break;
                    case 1:
                        basePrediction.fdc_id = matches[0].fdc_id;
                        console.log("Chose USDA item: ", matches[0].name, ' as best match, with FDC ID: ', matches[0].fdc_id);
                        break;
                    default:

                        // Get GPT's opinion on the best match
                        const { choice, usage } = await chooseUSDAItem({
                            options: matches.map(match => ({
                                name: match.name,
                                fdcId: match.fdc_id
                            })),
                            target: prediction.name,
                            images: processedPhotos.map(p => p.base64)
                        });

                        console.log("Choose USDA Item Usage:", usage);

                        prediction_usage.promptTokens = usage.promptTokens;
                        prediction_usage.completionTokens = usage.completionTokens;
                        prediction_usage.totalTokens = usage.totalTokens;

                        if (!choice) {
                            break;
                        }

                        if (choice.fdcId === 0 || choice.name.toLowerCase() === "no match") {
                            console.log("No match found for: ", prediction.name);
                            break;
                        }

                        basePrediction.fdc_id = choice.fdcId;
                        console.log("Chose USDA item: ", choice.name, ' as best match, with FDC ID: ', choice.fdcId);

                        break;

                }

                return basePrediction;
            })
        );

        console.log("creating predictions", mappedPredictions)
        await createPredictions(mappedPredictions);

        // const entryResult = await getEntry(entry.id);

        return NextResponse.json<PredictResponse>({
            success: true,
            entryId: entry.id
        });

    } catch (error) {
        console.error("Error in POST /api/v1/predict:", error);

        // Handle different error types if necessary
        // if (error instanceof SomeSpecificError) {
        //     return NextResponse.json<PredictResponse>(
        //         { success: false, error: error.message },
        //         { status: 400 }
        //     );
        // }

        // General error response
        return NextResponse.json<PredictResponse>(
            { success: false, error: "An unexpected error occurred. Details: " + JSON.stringify(error) },
            { status: 500 }
        );
    }
}
