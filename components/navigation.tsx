import Link from 'next/link'
import React from 'react'
import Logo from './logo'
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
const NavigationBar = ({
    ...props
}: Props) => {
    return (
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16" {...props}>
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <Link href="/">
                    <Logo className='h-8' />
                </Link>
                <HeaderAuth />
            </div>
        </nav>
    )
}

export default NavigationBar