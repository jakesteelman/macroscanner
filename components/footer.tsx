import React from 'react'
import { ThemeSwitcher } from './theme-switcher'

type Props = {} & React.HTMLAttributes<HTMLDivElement>

const Footer = ({
    ...props
}: Props) => {
    return (
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16" {...props}>
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <p>
                    © {new Date().getFullYear()} Macroscanner. All rights reserved.
                </p>
                <ThemeSwitcher />
            </div>
        </footer>
    )
}

export default Footer