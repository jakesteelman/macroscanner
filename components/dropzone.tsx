'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import Image from 'next/image'
import axios from 'axios'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { useRouter } from 'next/navigation'
import { fileToBase64 } from '@/utils/utils'
import { PredictRequest, PredictResponse } from '@/lib/types/predict'
import { Input } from './ui/input'

interface FileWithPreview extends File {
    preview: string;
}

export function Dropzone() {
    const [files, setFiles] = useState<FileWithPreview[]>([])
    const [comment, setComment] = useState<string>()
    const [name, setName] = useState<string>()
    const [uploading, setUploading] = useState(false)
    const router = useRouter()

    const [result, setResult] = useState<PredictResponse>()

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prevFiles => {
            const newFiles = acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }))
            const updatedFiles = [...prevFiles, ...newFiles].slice(0, 10) // Limit to 10 files
            return updatedFiles
        })
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxFiles: 10
    })

    const removeFile = (file: File) => {
        setFiles(prevFiles => prevFiles.filter(f => f !== file))
    }

    const uploadFiles = async () => {
        if (files.length === 0) return

        setUploading(true)

        // Send base64 images to /api/v1/predict
        try {
            const images = await Promise.all(files.map(file => fileToBase64(file as File)))
            const body: PredictRequest = {
                images,
                comment,
                name,
                // entryId: ''
            }

            const response = await axios
                .post<PredictResponse>('/api/v1/predict', body)

            setFiles([])

            setResult(response.data)

        } catch (error) {
            console.error(error)

        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div>
                <div
                    {...getRootProps()}
                    className={cn(
                        `border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors`,
                        isDragActive ? 'border-primary bg-primary/10' : 'border-border'
                    )}
                >
                    <input {...getInputProps()} aria-label="Food image upload" />
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                        {isDragActive
                            ? "Drop the images here"
                            : "Drag 'n' drop food images here, or click to select"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Upload up to 10 images
                    </p>
                </div>
                {files.length > 0 && (
                    <div className="mt-4">
                        <ScrollArea className="w-full rounded-md border">
                            <div className="flex flex-row items-center justify-start gap-4 p-4">
                                {files.map((file, index) => (
                                    <div key={index} className="relative group h-28 w-auto flex-shrink-0">
                                        <Image
                                            src={file.preview}
                                            alt={`Food image ${index + 1}`}
                                            width={150}
                                            height={150}
                                            className="relative w-auto h-28 rounded-md object-cover"
                                        />
                                        <Button
                                            size="sm"
                                            variant='secondary'
                                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity gap-1 text-xs w-8 h-8 p-1"
                                            onClick={() => removeFile(file)}
                                            aria-label={`Remove ${file.name}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <ScrollBar orientation='horizontal' />
                        </ScrollArea>
                        <div className="mt-4">
                            <Label htmlFor="comment">Name</Label>
                            <Input
                                className="w-full p-2 border border-border rounded-md"
                                placeholder="Give this meal a name (optional)..."
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <div className="mt-4">
                            <Label htmlFor="comment">Comment</Label>
                            <Textarea
                                className="w-full p-2 border border-border rounded-md"
                                placeholder="Add comments or notes about your meal that will help predictions (optional)"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                            />
                        </div>
                        <Button
                            className="w-full mt-4"
                            onClick={uploadFiles}
                            disabled={uploading}
                        >
                            {uploading ? 'Analyzing...' : `Analyze ${files.length} Food Image${files.length > 1 ? 's' : ''}`}
                        </Button>
                    </div>
                )}
                {result && (
                    <div className="mt-4">
                        <pre>
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    )
}

