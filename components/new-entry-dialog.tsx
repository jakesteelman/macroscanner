'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ImageUpload } from './image-upload'

export function NewEntryDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const handleImagesUploaded = async (images: File[]) => {
        // In a real app, you'd upload the images and create a new entry
        // For now, we'll just simulate this process
        const entryId = Math.random().toString(36).substr(2, 9)
        setIsOpen(false)
        router.push(`/entry/${entryId}`)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>New Entry</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Entry</DialogTitle>
                </DialogHeader>
                <ImageUpload onUpload={handleImagesUploaded} />
            </DialogContent>
        </Dialog>
    )
}

