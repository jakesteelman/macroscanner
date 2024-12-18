"use server";

import { createClient } from "@/utils/supabase/server";
import { getUser } from "./user";
import sharp from "sharp";

/**
 * Parameters for the uploadPhotos function
 */
type UploadPhotosParams = {
    /**
     * Array of base-64 strings representing the uploaded photos
     */
    images: Array<string>;
    /**
     * ID of an existing journal entry to attach the photos to
     */
    entryId: string;
}

/**
 * Uploads Photos to Supabase Storage and creates database records for them.
 * @param params - The parameters for the function.
 * @returns - The processed photos.
 */
export async function uploadPhotos({ images, entryId }: UploadPhotosParams) {
    if (images.length === 0) {
        throw new Error("No photos to upload");
    }

    if (images.length > 10) {
        throw new Error("You can only upload up to 5 photos at a time");
    }

    const supabase = await createClient();
    const user = await getUser();

    const processedPhotos = await Promise.all(
        images.map(async (base64, index) => {
            // Convert base64 to buffer
            const imageBuffer = Buffer.from(base64, 'base64');

            // Process with Sharp
            const resizedBuffer = await sharp(imageBuffer)
                .withMetadata()
                .rotate()
                .resize({ width: 1600, height: 1600, fit: 'inside' })
                .jpeg({ quality: 80 })
                .toBuffer();

            // Generate unique filename
            const uniqueFilename = `${user.id}/${Date.now()}_${index}.jpg`;

            // Upload to Supabase Storage
            const { data: storageData, error: uploadError } = await supabase.storage
                .from('images')
                .upload(uniqueFilename, resizedBuffer, {
                    contentType: 'image/jpeg',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Create database record
            const { data: photoRecord, error: dbError } = await supabase
                .from('photos')
                .insert({
                    user_id: user.id,
                    photo_url: uniqueFilename,
                    entry_id: entryId
                })
                .select()
                .single();

            if (dbError) throw dbError;

            // Add the base64 data back on to the photo record

            return {
                ...photoRecord,
                base64
            };
        })
    );

    return processedPhotos;
};