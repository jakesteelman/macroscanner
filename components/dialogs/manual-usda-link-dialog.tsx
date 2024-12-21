import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { PredictionWithUSDA } from '@/types';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { Check, ChevronLeft, ChevronRight, ExternalLink, Loader2, X } from 'lucide-react';
import useSWR from 'swr';
import { useCallback, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tables } from '@/types/database.types';
import { searchUSDAFoodsPaginated } from '@/actions/usda';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { linkPredictionToUSDAFood } from '@/actions/predictions';
import { toast } from 'sonner';
import { useTransition } from 'react';

type ManualLinkingDialogProps = {
    prediction: PredictionWithUSDA;
    children?: React.ReactNode;
};

export default function ManualLinkingDialog({ prediction, children }: ManualLinkingDialogProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isPending, startTransition] = useTransition();
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, error, isLoading } = useSWR(
        query ? ['usda-search', query, page, limit] : null,
        async ([_, query, page, limit]) => searchUSDAFoodsPaginated({ query, page, limit })
    );

    const handleSearch = () => {
        setPage(1);
        setQuery(inputValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const renderMacros = (food: Tables<'usda_foods'>) => {
        return <div>{Math.round(food.kcal || 0)}cal<br />{Math.round(food.fat || 0)}F&nbsp;{Math.round(food.carbs || 0)}C&nbsp;{Math.round(food.protein || 0)}P</div>;
    };

    const handleLinkPrediction = useCallback(async (selectedFdcId: number) => {
        startTransition(async () => {
            try {
                await linkPredictionToUSDAFood({ fdc_id: selectedFdcId, prediction_id: prediction.id })
                toast.success('Prediction linked to selected food');
                setDialogOpen(false);
            } catch (error) {
                toast.error('Error linking prediction to selected food');
            }
        });
    }, [prediction.id]);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogTitle>Manual Linking</DialogTitle>
                <div className='space-y-4'>
                    <p className='text-muted-foreground'>
                        Search for a USDA food item to link to "{prediction.name}"
                    </p>
                    <div className='flex flex-row items-center gap-2'>
                        <Input
                            placeholder='Search USDA foods...'
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1"
                        />
                        <Button onClick={handleSearch}>Search</Button>
                    </div>

                    {isLoading && (
                        <div className="flex justify-center p-4">
                            <Loader2 className="animate-spin" />
                        </div>
                    )}

                    {error && (
                        <div className="text-red-500 text-center">
                            Error loading results
                        </div>
                    )}

                    {data?.foods && (
                        <div className='space-y-4'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Macros (per 100g)</TableHead>
                                        <TableHead>Volume Support</TableHead>
                                        <TableHead />
                                        <TableHead />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.foods.map((food: Tables<'usda_foods'>) => (
                                        <TableRow key={food.fdc_id}>
                                            <TableCell>{food.name}</TableCell>
                                            <TableCell className="">
                                                {renderMacros(food)}
                                            </TableCell>
                                            <TableCell>
                                                {food.density ?
                                                    <Check className="text-green-500" /> :
                                                    <X className="text-red-500" />
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <Link href={`https://fdc.nal.usda.gov/food-details/${food.fdc_id}/nutrients`} className={cn(buttonVariants({ variant: 'link', size: 'sm' }), 'p-0 gap-1')} target="_blank">
                                                    FDC <ExternalLink className='size-4' />
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleLinkPrediction(food.fdc_id)}
                                                    disabled={isPending}
                                                >
                                                    {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Link'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="flex justify-center items-center gap-2">
                                <Button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    variant='outline'
                                    size='icon'
                                    className='size-8'
                                    aria-label='Previous Page'
                                >
                                    <ChevronLeft className='size-4' />
                                </Button>
                                <span className='size-sm text-muted-foreground'>Page {page}/{Math.ceil(data.total / limit)}</span>
                                <Button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page >= Math.ceil(data.total / limit)}
                                    variant='outline'
                                    size='icon'
                                    className='size-8'
                                    aria-label='Next Page'
                                >
                                    <ChevronRight className='size-4' />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

            </DialogContent>
        </Dialog>
    );
}