import Link from 'next/link';
import React from 'react';
import Logo from './logo';
import HeaderAuth from "@/components/header-auth";

type Props = {} & React.HTMLAttributes<HTMLDivElement>

/**
 * Navigation bar component
 * 
 * Renders a global navigation bar that appears across the entire application.
 * 
 * @param props 
 * @returns 
 */
export default async function NavigationBar({
    ...props
}: Props) {
    return (
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16" {...props}>
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <Link href="/" className='flex items-center gap-2'>
                    <Logo className='h-7' />
                </Link>
                <div className='flex gap-4 items-center justify-end'>
                    <HeaderAuth />
                </div>
            </div>
        </nav>
    );
}