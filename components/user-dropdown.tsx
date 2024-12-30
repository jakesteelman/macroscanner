import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LifeBuoy, Lightbulb, LogOut, Settings, Truck } from 'lucide-react'
import Link from 'next/link'
import { signOutAction } from '@/actions/auth'
import { User } from "@supabase/supabase-js"

interface UserDropdownProps {
    user: User
}

export default function UserDropdown({ user }: UserDropdownProps) {

    const roadmapURL = process.env.NEXT_PUBLIC_ROADMAP_URL ?? ''
    const feedbackURL = process.env.NEXT_PUBLIC_FEEDBACK_URL ?? ''
    const supportURL = process.env.NEXT_PUBLIC_SUPPORT_URL ?? ''

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
                        <AvatarFallback>{user.user_metadata.full_name?.split(' ').slice(0, 2).map((part: string) => part.charAt(0)).join('')}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.user_metadata.full_name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {roadmapURL !== '' && (
                    <DropdownMenuItem asChild>
                        <Link href={roadmapURL} target="_blank" className="cursor-pointer">
                            <Truck className="mr-2 h-4 w-4" />
                            <span>Roadmap</span>
                        </Link>
                    </DropdownMenuItem>
                )}
                {feedbackURL !== '' && (
                    <DropdownMenuItem asChild>
                        <Link href={feedbackURL} target="_blank" className="cursor-pointer">
                            <Lightbulb className="mr-2 h-4 w-4" />
                            <span>Feature Request</span>
                        </Link>
                    </DropdownMenuItem>
                )}
                {supportURL !== '' && (
                    <DropdownMenuItem asChild>
                        <Link href={supportURL} target="_blank" className="cursor-pointer">
                            <LifeBuoy className="mr-2 h-4 w-4" />
                            <span>Support</span>
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <form id='logout-form'>
                    <DropdownMenuItem asChild>
                        <button type='submit' formAction={signOutAction} className="w-full cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </button>
                    </DropdownMenuItem>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

