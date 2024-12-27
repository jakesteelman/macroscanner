import Logo from "@/components/logo";
import Link from "next/link";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className="flex items-center gap-2 self-center font-medium">
                    <Logo className="h-8" />
                </Link>
                {children}
            </div>
        </div>
    );
}
