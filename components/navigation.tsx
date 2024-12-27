import Link from 'next/link'
import React from 'react'
import Logo from './logo'
import HeaderAuth from "@/components/header-auth";
import { buttonVariants } from './ui/button';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { getSubscription } from '@/actions/subscriptions';
import { ThemeSwitcher } from './theme-switcher';

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

    const subscription = await getSubscription();

    return (
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16" {...props}>
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <Link href="/" className='flex items-center gap-2'>
                    <Logo className='h-7' />
                    {subscription ? <Badge variant='outline' className="text-[#926c15] border-[#926c15] dark:text-[#a47e1b] dark:border-[#a47e1b]">PRO</Badge> : <Badge variant='outline' className='text-xs'>BETA</Badge>}
                </Link>
                <div className='flex gap-4 items-center justify-end'>
                    {!subscription && <Link href="/pro" className={cn('text-yellow-600 dark:text-yellow-500', buttonVariants({ variant: 'ghost', size: 'sm' }))}>
                        <Crown className='h-4 w-4' />
                        Get Pro
                    </Link>}
                    <ThemeSwitcher />
                    <HeaderAuth />
                </div>
            </div>
        </nav>
    );
}