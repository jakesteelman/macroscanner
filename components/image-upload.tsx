'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
    onUpload: (files: File[]) => void
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
    const [files, setFiles] = useState<File[]>([])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files))
        }
    }

    const handleUpload = () => {
        onUpload(files)
    }

    return (
        <div className="space-y-4">
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
            />
            {files.length > 0 && (
                <div>
                    <p>{files.length} file(s) selected</p>
                    <Button onClick={handleUpload}>Upload and Create Entry</Button>
                </div>
            )}
        </div>
    )
}

