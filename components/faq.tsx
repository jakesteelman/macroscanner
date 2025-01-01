import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

type FaqProps = {
    faq: Array<{
        question: string
        answer: string
    }>
}

export default function Faq({
    faq
}: FaqProps) {
    return (
        <Accordion type="single" collapsible className="w-full">
            {faq.map(({ question, answer }) => (
                <AccordionItem value={question} key={question}>
                    <AccordionTrigger className='!no-underline text-lg'>{question}</AccordionTrigger>
                    <AccordionContent className='text-muted-foreground text-base'>
                        {answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}