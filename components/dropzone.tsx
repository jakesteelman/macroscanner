'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import Image from 'next/image'
import axios from 'axios'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { fileToBase64 } from '@/lib/utils'
import { PredictRequest, PredictResponse } from '@/types/predict'
import { Input } from './ui/input'
import { v4 as uuidv4 } from 'uuid';

interface FileWithPreview extends File {
    id: string;
    preview: string;
    uploading: boolean;
    uploaded: boolean;
    uploadProgress: number;
    error?: string;
    fileId?: string;
}

export function Dropzone() {
    const [files, setFiles] = useState<FileWithPreview[]>([])
    const [comment, setComment] = useState<string>()
    const [name, setName] = useState<string>()
    const [uploading, setUploading] = useState(false)
    const [result, setResult] = useState<PredictResponse>()

    const uploadFile = async (file: FileWithPreview) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('/api/v1/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );

                        setFiles(prevFiles =>
                            prevFiles.map(f => {
                                if (f.id === file.id) {
                                    return {
                                        ...f,
                                        uploadProgress: progress,
                                    };
                                }
                                return f;
                            })
                        );
                    }
                }
            });

            setFiles(prevFiles =>
                prevFiles.map(f => {
                    if (f.id === file.id) {
                        return {
                            ...f,
                            uploading: false,
                            uploaded: true,
                            uploadProgress: 100,
                            fileId: response.data.fileId
                        };
                    }
                    return f;
                })
            );
        } catch (error) {
            setFiles(prevFiles =>
                prevFiles.map(f => {
                    if (f.id === file.id) {
                        return {
                            ...f,
                            uploading: false,
                            uploadProgress: 0,
                            error: 'Upload failed'
                        };
                    }
                    return f;
                })
            );
            console.error(error);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map(file => {
            const fileWithPreview: FileWithPreview = Object.assign(file, {
                id: uuidv4(),
                preview: URL.createObjectURL(file),
                uploading: true,
                uploaded: false,
                uploadProgress: 0
            });

            uploadFile(fileWithPreview);

            return fileWithPreview;
        });

        setFiles(prevFiles => [...prevFiles, ...newFiles].slice(0, 10));
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxFiles: 10
    })

    const removeFile = (file: FileWithPreview) => {
        setFiles(prevFiles => prevFiles.filter(f => f.id !== file.id))
    }

    const uploadFiles = async () => {
        if (files.length === 0) return;
        if (files.some(file => file.uploading || !file.uploaded)) {
            alert('Please wait for all files to finish uploading.');
            return;
        }

        setUploading(true);

        try {
            const fileIds = files
                .map(file => file.fileId)
                .filter((fileId): fileId is string => !!fileId);

            const body: PredictRequest = {
                fileIds,
                comment,
                name
            };

            const response = await axios.post<PredictResponse>('/api/v1/predict', body);

            setFiles([]);
            setResult(response.data);

        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

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
                                {files.map((file) => (
                                    <div key={file.id} className="relative group h-28 w-auto flex-shrink-0">
                                        <Image
                                            src={file.preview}
                                            alt={`Food image`}
                                            width={150}
                                            height={150}
                                            className="relative w-auto h-28 rounded-md object-cover"
                                        />
                                        {(file.uploading || file.error) && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                                                {file.uploading && (
                                                    <div className="text-white text-sm">
                                                        Uploading... {file.uploadProgress}%
                                                    </div>
                                                )}
                                                {file.error && (
                                                    <div className="text-red-500 text-sm">
                                                        {file.error}
                                                    </div>
                                                )}
                                            </div>
                                        )}
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

