import { ThemeProvider } from "next-themes";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import localFont from 'next/font/local';
import type { Metadata, Viewport } from 'next'

const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Macroscanner | AI-Powered Food Photo Journal",
    description: "Effortless Food Intelligence. Macroscanner is an AI-powered food photo journal that helps you track your diet and nutrition.",
    applicationName: "Macroscanner",
    openGraph: {
        title: "Macroscanner | AI-Powered Food Photo Journal",
        description: "Effortless Food Intelligence. Macroscanner is an AI-powered food photo journal that helps you track your diet and nutrition.",
        url: defaultUrl,
        siteName: "Macroscanner",
        images: [
            {
                url: `${defaultUrl}/og-image.webp`,
                width: 1200,
                height: 630,
                alt: "An image showing Macroscanner's logo with the text AI Powered Food Nutrition Scanner.",
            }
        ],
        locale: "en_US",
        type: 'website'
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
}

const font = localFont({
    src: './AspektaVF.woff2',
    display: 'swap',
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={font.className} suppressHydrationWarning>
            <body className="bg-background text-foreground">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <TooltipProvider>
                        {children}
                    </TooltipProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
