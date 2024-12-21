import Link from "next/link";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-row items-start justify-stretch">
            <div className="flex flex-col items-start justify-start w-1/4">
                <Link href="/account">
                    Account
                </Link>
                <Link href="/account/settings">
                    Settings
                </Link>
                <Link href="/account/subscription">
                    Subscription
                </Link>
            </div>
            {children}
        </div>
    );
}
