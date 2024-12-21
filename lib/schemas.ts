import * as z from "zod"

export const foodImageFormSchema = z.object({
    images: z.array(z.object({
        id: z.string(),
        preview: z.string(),
        name: z.string(),
        size: z.number(),
        type: z.string(),
        lastModified: z.number(),
        uploading: z.boolean(),
        uploaded: z.boolean(),
        uploadProgress: z.number(),
        error: z.string().optional(),
        fileId: z.string().optional(),
    })).min(1, "At least one image is required"),
    name: z.string().optional(),
    comment: z.string().optional(),
})

export type FoodImageFormValues = z.infer<typeof foodImageFormSchema>
