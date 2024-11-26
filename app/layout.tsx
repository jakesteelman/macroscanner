import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import NavigationBar from "@/components/navigation";
import Footer from "@/components/footer";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Macroscanner | AI-Powered Food Photo Journal",
    description: "Effortless Food Intelligence. Macroscanner is an AI-powered food photo journal that helps you track your diet and nutrition.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={GeistSans.className} suppressHydrationWarning>
            <body className="bg-background text-foreground">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <main className="min-h-screen flex flex-col items-center">
                        <div className="flex-1 w-full flex flex-col gap-8 items-stretch">
                            <NavigationBar />
                            <div className="flex flex-col gap-20 max-w-5xl p-5 w-full mx-auto">
                                {children}
                            </div>
                            <Footer />
                        </div>
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}