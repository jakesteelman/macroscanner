'use client'
import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Images, Loader2, Plus, Scan, ScanBarcode, Sparkles, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import Image from 'next/image'
import axios from 'axios'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { PredictRequest, PredictResponse } from '@/types/predict'
import { Input } from './ui/input'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

interface FileWithPreview extends File {
    id: string;
    preview: string;
    uploading: boolean;
    uploaded: boolean;
    uploadProgress: number;
    error?: string;
    fileId?: string;
}

export function Dropzone({ isAllowed = true }: { isAllowed: boolean }) {
    const [files, setFiles] = useState<FileWithPreview[]>([])
    const [comment, setComment] = useState<string>()
    const [name, setName] = useState<string>()
    const [uploading, setUploading] = useState(false)
    const [showDropzone, setShowDropzone] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (files.length > 0) {
            setShowDropzone(false)
        }
    }, [files])

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

        if (!isAllowed) {
            return toast.error('You aren\'t a Macroscanner member!', {
                richColors: true,
                description() {
                    return (
                        <span>Please subscribe <Link className='border-b border-current' href='/subscribe'>here</Link> to use this feature.</span>
                    );
                },
            });
        }

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

            const response = await axios.post<PredictResponse>('/api/v1/predict', body, {
                validateStatus: (status) => status < 500 // Accept any status < 500 as a valid response
            });

            const data = response.data;

            if (data.success) {
                router.push(`/entries/${data.entryId}`);
                setFiles([]);
            } else {
                if (data.error?.reason === 'NotSubscribed') {
                    toast.error('You aren\'t a Macroscanner member!', {
                        richColors: true,
                        description() {
                            return (
                                <span>Please subscribe <Link className='border-b border-current' href='/subscribe'>here</Link> to use this feature.</span>
                            );
                        },
                    });
                } else if (data.error?.reason === 'Unauthorized') {
                    toast.error('You must be logged in to use this feature.');
                } else {
                    throw new Error(data.error?.message || 'Unknown error occurred');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while processing your request. Please contact support if the issue persists.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full mx-auto">
            {showDropzone ? (
                <div
                    {...getRootProps()}
                    className={cn(
                        `border-2 border-dashed rounded-lg px-16 py-32 md:p-16 text-center cursor-pointer transition-colors`,
                        isDragActive ? 'border-primary bg-primary/10' : 'border-border'
                    )}
                >
                    <input {...getInputProps()} aria-label="Food image upload" />
                    <Images className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-base text-muted-foreground">
                        {isDragActive
                            ? "Drop the images here"
                            : "Drag 'n' drop food images here, or click to select"}
                    </p>
                    <p className="mt-1 text-xs lg:text-sm text-muted-foreground">
                        Upload up to 10 images
                    </p>
                </div>
            ) : (
                <Button variant='outline' className='w-full border-2 border-border border-dashed' onClick={() => setShowDropzone(true)}>
                    <Plus className='h-4 w-4' />
                    Add more</Button>
            )}
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
                                        <div className="absolute inset-0 rounded-md flex flex-col items-center justify-center text-center text-xs font-semibold bg-black/50 text-white">
                                            {file.uploading && (
                                                <>
                                                    <Loader2 className='animate-spin size-6' />
                                                    Uploading... {file.uploadProgress}%
                                                </>
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
                            className="w-full p-2 border border-border rounded-md text-base placeholder:text-base"
                            placeholder="Give this meal a name (optional)..."
                            defaultValue={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="mt-4">
                        <Label htmlFor="comment">Comment</Label>
                        <Textarea
                            className="w-full p-2 border border-border rounded-md text-base placeholder:text-base"
                            placeholder="Add comments or notes about your meal that will help predictions (optional)"
                            defaultValue={comment}
                            onChange={e => setComment(e.target.value)}
                            rows={5}
                        />
                    </div>
                    <Button
                        variant='secondary'
                        className="text-white font-semibold w-full mt-4 border-border border-1 bg-[linear-gradient(to_right,theme(colors.emerald.500),theme(colors.sky.500),theme(colors.indigo.500),theme(colors.sky.500),theme(colors.emerald.500))] animate-gradient bg-[length:200%_auto]"
                        onClick={uploadFiles}
                        disabled={uploading}
                    >
                        <ScanBarcode className="h-4 w-4" />
                        {uploading ? 'Scanning...' : `Scan ${files.length} Food Image${files.length > 1 ? 's' : ''}`}
                    </Button>
                </div>
            )}
        </div>
    )
}

