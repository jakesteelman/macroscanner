// api/v1/predict/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { uploadPhotos } from "@/actions/photos";
import { createBlankEntry, getEntry } from "@/actions/entries";
import { chooseUSDAItem, predict } from "@/actions/predict";
import { PredictRequest, PredictResponse } from "@/types/predict";
import { createPredictions } from "@/actions/predictions";
import { LanguageModelUsage } from "@/types/ai.types";
import { z } from "zod";
import { PredictionSchema } from "@/lib/ai/schemas";
import { TablesInsert } from "@/database.types";
import OpenAI from "openai";
import { searchUSDAFoods } from "@/actions/usda";


export async function POST(request: Request) {
    const supabase = await createClient();
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

        let result: z.infer<typeof PredictionSchema>, prediction_usage: LanguageModelUsage;

        try {
            const { object, usage } = await predict({
                images: processedPhotos.map(photo => photo.base64),
                comment
            });

            result = object;
            prediction_usage = usage;

        } catch (error) {
            console.error('Error predicting:', error);
            throw error;
        }

        // Embed the predictions
        const {
            data: embeddingData,
            // TODO: Handle usage data.
            // usage: embeddingUsage 
        } = await openai.embeddings.create({
            dimensions: 1536,
            model: 'text-embedding-3-small',
            input: result.predictions.map(prediction => prediction.name)
        })

        const predictions = result.predictions.map((prediction, index) => ({
            ...prediction,
            embedding: embeddingData.find(embedding => embedding.index === index)?.embedding
        }))

        // Now search USDA for each item, get the FDC ID and name of the top 5 results,
        // then ask GPT to self evaluate. We can also pass the photo referenced by the prediction
        // to the GPT model to help improve accuracy.
        const mappedPredictions: TablesInsert<"predictions">[] = await Promise.all(
            predictions.map(async (prediction) => {

                const basePrediction: TablesInsert<'predictions'> = {
                    name: prediction.name,
                    quantity: prediction.amount,
                    unit: prediction.unit,
                    photo_id: processedPhotos[prediction.photoIndex].id,
                    fdc_id: undefined
                }

                console.debug('Searching for:', prediction.name);
                console.debug("Embedding length", prediction.embedding?.length);

                const {
                    matches,
                    // embedding_usage
                    // TODO: Handle usage data.
                } = await searchUSDAFoods({
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
        )

        try {
            await createPredictions(mappedPredictions)
        } catch (error) {
            console.error('Error creating predictions:', error);
            throw error;
        }

        // Finally, select out the whole thing
        try {
            const entryResult = await getEntry(entry.id);

            return NextResponse.json<PredictResponse>({
                success: true,
                result: entryResult
            });

        } catch (error) {
            console.error('Error fetching full entry:', error);
            throw error;
        }

    } catch (error) {
        console.error('ERROR in PREDICT:', error);
        return NextResponse.json<PredictResponse>(
            { success: false, error: "Failed to predict for entry." },
            { status: 500 }
        );
    }
}
