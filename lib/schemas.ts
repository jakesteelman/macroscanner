import * as z from "zod"

export const foodImageFormSchema = z.object({
    images: z.array(z.object({
        id: z.string(),
        preview: z.string(),
        file: z.instanceof(File),
        fileId: z.string().optional(),
    })).min(1, "At least one image is required"),
    name: z.string().optional(),
    comment: z.string().optional(),
})

export type FoodImageFormValues = z.infer<typeof foodImageFormSchema>