import { createClient } from '@/utils/supabase/server'
import Image, { ImageProps } from 'next/image'
import React from 'react'

type Props = {
    path: string,
    supabaseOptions?: {
        transform: {
            format?: "origin",
            width?: number,
            height?: number,
            quality?: number,
            resize?: "cover" | "contain" | "fill"
        }
    }
} & Omit<ImageProps, 'src'>

const SupabaseImage = async ({ path, supabaseOptions, ...props }: Props) => {

    const supabase = await createClient()

    const { data, error } = await supabase
        .storage
        .from('images')
        .createSignedUrl(path, 3600, { transform: supabaseOptions?.transform })

    if (error) {
        console.error('Error fetching image:', error)
        return <div>Error getting image</div>
    }

    if (!data) {
        // TODO: Return a placeholder
        return <div>Image not found</div>
    }

    return (
        <Image
            src={data.signedUrl}
            {...props}
        />
    )
}

export default SupabaseImage