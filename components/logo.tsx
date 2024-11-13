"use client"
import { useTheme } from 'next-themes'
import Image from 'next/image'
import React from 'react'

type Props = {
    className?: string
} & React.HTMLAttributes<HTMLDivElement>

const Logo = (props: Props) => {
    const { theme } = useTheme()
    return (
        <Image
            src={theme === "dark" ? "/logos/macroscanner-horizontal-light.svg" : "/logos/macroscanner-horizontal-dark.svg"}
            alt="Macroscanner Logo"
            width={200}
            height={50}
            {...props}
        />
    )
}

export default Logo