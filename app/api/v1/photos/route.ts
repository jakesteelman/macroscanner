// app/api/v1/photos/route.ts
import { createClient } from "@/utils/supabase/server";
import sharp from "sharp";

export async function POST(request: Request) {
    const supabase = await createClient();
    const formData = await request.formData();

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        return new Response(JSON.stringify({ error: "Failed to get user" }), { status: 401 });
    }

    const photos = formData.getAll('photos');
    const resizedPhotos = await Promise.all(photos.map(async (photo, index) => {
        if (photo instanceof File) {
            const buffer = await photo.arrayBuffer();
            const resizedBuffer = await sharp(Buffer.from(buffer))
                .resize({ width: 1600, height: 1600, fit: 'inside' })
                .jpeg()
                .toBuffer();

            const { data, error } = await supabase.storage
                .from('photos')
                .upload(`${user.id}/photo_${index}.jpeg`, resizedBuffer, {
                    contentType: 'image/jpeg'
                });

            if (error || !data) {
                throw new Error(`Failed to upload photo: ${error.message}`);
            }

            return data;
        } else {
            throw new Error("Invalid photo type");
        }
    }));

    for (const storedPhoto of resizedPhotos) {
        const {
            data: photoData,
            error: photoError
        } = await supabase.from('photos').insert({
            user_id: user.id,
            photo_url: storedPhoto.fullPath,

        });


    }
}