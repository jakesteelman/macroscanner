import { SidebarNav } from "@/components/settings/sidebar-nav";
import { Separator } from "@/components/ui/separator";

const settingsLinks = [
    { title: "Settings", href: "/settings" },
    { title: "Account", href: "/settings/account" },
    { title: "Subscription", href: "/settings/subscription" },
]

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="space-y-6">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account settings, subscription, and more.
                </p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <SidebarNav items={settingsLinks} />
                </aside>
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}


// <div className="w-full space-y-6">
//     <div className="w-full pb-6 pt-2 border-b flex flex-row items-center justify-between">
//         <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
//         <form action={signOutAction}>
//             <Button type="submit" variant={"outline"}>
//                 Log out
//                 <LogOut className="size-4" />
//             </Button>
//         </form>
//     </div>
//     <div className="flex flex-row items-start justify-stretch">
//         <div className="flex flex-col items-start justify-start w-1/3">
//             <ul className="flex flex-col gap-2">
//                 {settingsLinks.map((link) => (
//                     <li key={link.href}>
//                         <SettingsLink href={link.href} className="text-muted-foreground w-full" activeClassName="!text-foreground font-medium">
//                             {link.label}
//                         </SettingsLink>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//         <div className="w-full">
//             {children}
//         </div>
//     </div>
// </div>