import Link from 'next/link'
import React from 'react'

type Props = {} & React.HTMLAttributes<HTMLDivElement>

const Footer = ({
    ...props
}: Props) => {

    const feedbackURL = process.env.NEXT_PUBLIC_FEEDBACK_URL ?? 'https://macroscanner.canny.io/'
    const supportURL = process.env.NEXT_PUBLIC_SUPPORT_URL ?? 'mailto:support@macroscanner.com'
    const termsURL = process.env.NEXT_PUBLIC_TOS_URL ?? 'https://macroscanner.com/legal/terms-of-service'
    const privacyURL = process.env.NEXT_PUBLIC_PRIVACY_URL ?? 'https://macroscanner.com/legal/privacy-policy'

    return (
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-6" {...props}>
            <div className="w-full max-w-5xl flex flex-col items-start justify-start md:flex-row md:justify-between md:items-center p-3 px-5 text-sm">
                <p className='text-muted-foreground'>
                    &copy; {new Date().getFullYear()} Macroscanner. All rights reserved.
                </p>
                <div className='flex gap-4 items-center justify-end'>
                    <Link
                        href={feedbackURL}
                        target='_blank'
                        className='text-muted-foreground hover:underline'
                    >
                        Feedback
                    </Link>
                    <Link
                        href={supportURL}
                        target='_blank'
                        className='text-muted-foreground hover:underline'
                    >
                        Support
                    </Link>
                    <Link
                        href={termsURL}
                        target='_blank'
                        className='text-muted-foreground hover:underline'
                    >
                        Terms
                    </Link>
                    <Link
                        href={privacyURL}
                        target='_blank'
                        className='text-muted-foreground hover:underline'
                    >
                        Privacy
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer