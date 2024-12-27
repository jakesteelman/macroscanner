"use client"
import { cn } from '@/lib/utils'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

type Props = {
    activeClassName?: string
} & LinkProps & React.HTMLAttributes<HTMLAnchorElement>

export default function SettingsLink({ activeClassName, className, children, ...props }: Props) {

    const pathname = usePathname()
    const isActive = pathname === props.href

    return (
        <Link
            className={cn(isActive && activeClassName, className)}
            {...props}
        >
            {children}
        </Link>
    )
}