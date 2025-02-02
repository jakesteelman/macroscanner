import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { getEntries } from "../../actions/entries";
import { Dropzone } from "@/components/dropzone";
import SupabaseImage from "@/components/supabase-image";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, GalleryVerticalEnd, MoreHorizontal } from "lucide-react";
import EntryCardSkeleton from "@/components/loading/entry-card-skeleton";
import { getSubscribedUser } from "@/actions/user";

export default async function JournalPage() {

    const user = await getSubscribedUser();

    if (!user) {
        return redirect("/sign-in");
    }

    console.log('user is member', user.isMember)

    return (
        <div className="container mx-auto p-0 space-y-6">
            <div className="w-full">
                <Dropzone isAllowed={user.isMember} />
            </div>
            <div className="space-y-4">
                <div className="flex flex-row items-center justify-between">
                    <h2 className="text-2xl font-semibold">Recent Entries</h2>
                    <Link className={buttonVariants({ variant: 'link' })} href='/entries/'>
                        All entries
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
                <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => <EntryCardSkeleton key={`entry-skeleton-${i}`} />)}
                </div>}>
                    <JournalEntries />
                </Suspense>
            </div>
        </div>
    )
}

async function JournalEntries() {
    const entries = await getEntries()

    return (entries && entries.length > 0) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry) => (
                <Link key={entry.id} href={`/entries/${entry.id}`} className="block">
                    <Card className="overflow-hidden">
                        <div className="relative w-full">
                            {entry.photos.slice(0, 1).map((photo, index) => (
                                <SupabaseImage
                                    key={photo.id}
                                    path={photo.photo_url}
                                    supabaseOptions={{
                                        transform: {
                                            resize: "cover",
                                            width: 512,
                                            height: 512,
                                            quality: 80
                                        }
                                    }}
                                    alt={`${entry.name} - Image ${index + 1}`}
                                    width={512}
                                    height={512}
                                    className={`w-full h-full object-cover aspect-video`}
                                />
                            ))}
                        </div>
                        <CardContent className="p-4">
                            <div className="flex flex-row items-center justify-between">
                                <h3 className="font-semibold text-lg mb-2">{entry.name}</h3>
                                <Button className="size-6 flex items-center justify-center relative z-10" variant={'ghost'} size={'icon'} role='button'>
                                    <MoreHorizontal className="size-4" />
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{format(entry.created_at, 'h:mm a – MMMM d, yyyy')}</p>
                            {/* <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>Calories: {entry.calories}</div>
                                <div>Protein: {entry.protein}g</div>
                                <div>Carbs: {entry.carbs}g</div>
                                <div>Fat: {entry.fat}g</div>
                            </div> */}
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    ) : (
        <div className="bg-muted rounded-lg p-16 text-center transition-colors text-muted-foreground flex flex-col items-center justify-center gap-2">
            <GalleryVerticalEnd className="size-8 mx-auto" />
            <div>
                <h3 className="font-medium">
                    No entries found
                </h3>
                <p className="text-sm">
                    Get started by adding your first entry
                </p>
            </div>
        </div>
    )
}