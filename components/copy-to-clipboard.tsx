'use client';

import { Button } from '@/components/ui/button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface CopyToClipboardProps {
    content: string;
    duration?: number;
}

export function CopyToClipboard({ content, duration = 1000 }: CopyToClipboardProps) {
    const [copied, setCopied] = useState(false);
    // eslint-disable-next-line
    const [_, copy] = useCopyToClipboard();

    const handleCopy = async () => {
        await copy(content);
        setCopied(true);
        setTimeout(() => setCopied(false), duration);
    };

    return (
        <Button
            variant="outline"
            size="sm"
            className='gap-1.5'
            onClick={handleCopy}
        >
            {copied ? (
                <>
                    <Check className="h-4 w-4" />
                    Copied!
                </>
            ) : (
                <>
                    <Copy className="h-4 w-4" />
                    Copy
                </>
            )}

        </Button>
    );
}