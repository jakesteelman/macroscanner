// app/(app)/_actions/predict.ts
"use server"
import { LanguageModelUsage } from '@/types/ai.types';
import { chooseUSDAItemPrompt, predictPrompt } from '@/lib/ai/prompt';
import { PredictionSchema, USDAChosenItemSchema } from '@/lib/ai/schemas';
import { openai } from '@ai-sdk/openai';
import { CoreSystemMessage, CoreUserMessage, generateObject, ImagePart, TextPart } from 'ai';
import { z } from 'zod';

type PredictRequest = {
    /** Array of base64 strings representing the uploaded photos */
    images: string[];
    /** Optional user-supplied comment about the meal or entry in general. */
    comment?: string;
};

export async function predict({ images, comment }: PredictRequest): Promise<{ object: z.infer<typeof PredictionSchema>, usage: LanguageModelUsage }> {

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

    const { object, usage } = await generateObject({
        model: openai('gpt-4o'),
        schema: PredictionSchema,
        temperature: 0.02,
        messages: [
            systemMessage,
            userMessage
        ]
    });

    return {
        object,
        usage
    };
}

type ChooseUSDAItemRequest = {
    /** Array of possible food items to choose from */
    options: {
        /** Name of the food item in USDA DB */
        name: string;
        /** USDA FoodData Central ID */
        fdcId: number;
    }[];
    /** Name of the target food item to match. */
    target: string;
    /** Array of base64 strings representing the photos where the food is believed to be contained. */
    images: string[];
    /** Optional user-supplied comment about the meal or entry in general. */
    comment?: string;
};

/**
 * 
 * @param param0 
 * @returns 
 */
export async function chooseUSDAItem({
    options,
    target,
    images,
    comment,
}: ChooseUSDAItemRequest): Promise<{
    choice: z.infer<typeof USDAChosenItemSchema>,
    usage: LanguageModelUsage
}> {

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
        content: chooseUSDAItemPrompt(options, target)
    };

    const { object, usage } = await generateObject({
        model: openai('gpt-4o-mini'),
        schema: USDAChosenItemSchema,
        messages: [
            systemMessage,
            userMessage
        ]
    });

    return {
        choice: object,
        usage
    };
}
