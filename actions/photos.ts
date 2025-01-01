"use server";

import { createClient } from "@/lib/supabase/server";
import { getSubscribedUser, getUser } from "./user";
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
    const user = await getSubscribedUser();

    if (!user) {
        throw new Error("User is not authenticated");
    }

    if (!user.isMember) {
        throw new Error("User is not a current subscriber");
    }

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

/**
 * Retrieves an uploaded photo from Supabase Storage and returns its base64 representation.
 * @param userId - The user's ID.
 * @param fileId - The ID of the uploaded file.
 * @returns - An object containing the photo's base64 data.
 */
export async function getUploadedPhoto(userId: string, fileId: string) {
    const supabase = await createClient();

    // Correct the bucket name to 'images' and include the '.jpg' extension
    const { data: fileData, error: downloadError } = await supabase
        .storage
        .from('images')
        .download(`${userId}/${fileId}.jpg`);

    if (downloadError || !fileData) {
        throw new Error('Failed to retrieve uploaded photo');
    }

    // Convert the file data to base64
    const arrayBuffer = await fileData.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return {
        base64
    };
}