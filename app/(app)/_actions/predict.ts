// app/(app)/_actions/predict.ts
"use server"
import { predictPrompt } from '@/utils/ai/prompt';
import { PredictionSchema } from '@/utils/ai/schemas';
import { openai } from '@ai-sdk/openai';
import { CoreSystemMessage, CoreUserMessage, generateObject, ImagePart, TextPart } from 'ai';
import { z } from 'zod';

type PredictRequest = {
    /** Array of base64 strings representing the uploaded photos */
    images: string[];
    /** Optional user-supplied comment about the meal or entry in general. */
    comment?: string;
};

export async function predict({ images, comment }: PredictRequest): Promise<z.infer<typeof PredictionSchema>> {

    const imageContentParts: ImagePart[] = images.map((image) => ({
        type: "image",
        image: image
    }));

    const userCommentPart: TextPart | undefined = comment ? {
        type: "text",
        text: comment
    } : undefined;

    const userMessage: CoreUserMessage = {
        role: "user",
        content: [
            userCommentPart,
            ...imageContentParts
        ].filter((part): part is TextPart | ImagePart => part !== undefined)
    };

    const systemMessage: CoreSystemMessage = {
        role: "system",
        content: predictPrompt
    };

    const { object } = await generateObject({
        model: openai('gpt-4o-mini'),
        schema: PredictionSchema,
        messages: [
            systemMessage,
            userMessage
        ]
    });

    return object;
}