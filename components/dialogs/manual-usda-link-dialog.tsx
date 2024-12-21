import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { PredictionWithUSDA } from '@/types';

type ManualLinkingDialogProps = {
    prediction: PredictionWithUSDA;
    children?: React.ReactNode;
};

export default function ManualLinkingDialog({ prediction, children }: ManualLinkingDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Manual Linking</DialogTitle>
                {/* TODO: Implement Manual Linking */}
                <p>
                    This food item could not be automatically linked to a USDA food item. Please search for the food item in our database, find the most ideal one, and link it to update the total meal macros.
                </p>
            </DialogContent>
        </Dialog>
    );
}