import { Button } from '@/components/ui/button';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function PredictionCardSkeleton() {
    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between gap-2 px-4 pt-4 pb-0'>
                <Skeleton className='h-6 w-64 inline-block' />
                <div className='flex flex-row items-center justify-end gap-2 !m-0'>
                    <Button
                        size='icon'
                        variant='ghost'
                        className='size-8'
                    >
                        <ThumbsUp className='size-4' />
                    </Button>
                    <Button
                        variant='ghost'
                        size='icon'
                        className='size-8'
                    >
                        <ThumbsDown className='size-4' />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className='px-4 pb-4 pt-2 space-y-4'>
                <Skeleton className='h-5 w-44' />
                <div className='w-full flex flex-row items-center justify-start gap-2'>
                    <Skeleton className='w-20 h-5 inline-block' />
                    <Skeleton className='w-24 h-5 inline-block' />
                    <Skeleton className='w-16 h-5 inline-block' />
                    <Skeleton className='w-20 h-5 inline-block' />
                </div>
            </CardContent>
        </Card>
    );
}