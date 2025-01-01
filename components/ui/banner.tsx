import React from 'react'

type Props = {
    children: React.ReactNode
}

export default function Banner({ children }: Props) {
    return (
        <div className='bg-primary w-full px-6 py-2'>
            <div className='max-w-5xl mx-auto text-center text-primary-foreground text-sm'>
                {children}
            </div>
        </div>
    )
}