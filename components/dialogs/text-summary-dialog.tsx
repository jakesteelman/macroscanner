import { ScanText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { CopyToClipboard } from '@/components/copy-to-clipboard';
import { Textarea } from '@/components/ui/textarea';

type TextSummaryDialogProps = {
    text: string;
}

export default function TextSummaryDialog({ text }: TextSummaryDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='outline'>
                    <ScanText className='size-4' />
                    Text Summary
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Text Summary</DialogTitle>
                <Textarea value={text} readOnly rows={10} />
                <CopyToClipboard content={text} />
            </DialogContent>
        </Dialog>
    );
}