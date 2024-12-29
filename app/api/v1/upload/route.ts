import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

export async function POST(request: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as Blob | null;

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Convert Blob to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Process image with Sharp
        const processedBuffer = await sharp(buffer)
            .withMetadata()
            .rotate()
            .resize({ width: 1200, height: 1200, fit: 'inside' })
            .jpeg({ quality: 80 })
            .toBuffer();

        const fileId = uuidv4();
        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(`${user.id}/${fileId}.jpg`, processedBuffer, {
                contentType: 'image/jpeg',
                upsert: false
            });

        if (uploadError) {
            throw uploadError;
        }

        return NextResponse.json({ success: true, fileId });

    } catch (error) {
        console.error("Error in POST /api/v1/upload:", error);
        return NextResponse.json(
            { success: false, error: 'An unexpected error occurred.' },
            { status: 500 }
        );
    }
}