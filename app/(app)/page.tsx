import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { getEntries } from "./_actions/entries";
import { Dropzone } from "@/components/dropzone";
import SupabaseImage from "@/components/supabase-image";

export default async function JournalPage() {

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return (
        <div className="container mx-auto p-4">
            <Dropzone />
            <div>

                <h2 className="text-2xl font-semibold mt-8">Entries</h2>
                <Suspense fallback={<div>Loading entries...</div>}>
                    <JournalEntries />
                </Suspense>
            </div>
        </div>
    )
}

async function JournalEntries() {
    const entries = await getEntries()

    return (
        <div className="space-y-4 mt-4">
            {entries.map((entry) => (
                <Link key={entry.id} href={`/entry/${entry.id}`} className="block">
                    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 mr-4">
                                {entry.photos.slice(0, 1).map((photo, index) => (
                                    <SupabaseImage
                                        key={photo.id}
                                        path={photo.photo_url}
                                        supabaseOptions={{
                                            transform: {
                                                resize: "cover",
                                                width: 100,
                                                height: 100,
                                                quality: 75
                                            }
                                        }}
                                        alt={`${entry.name} - Image ${index + 1}`}
                                        width={100}
                                        height={100}
                                        className={`rounded-md w-24 h-24`}
                                    />
                                ))}
                                {entry.photos.length > 3 && (
                                    <div className="mt-2 text-sm text-gray-500">
                                        +{entry.photos.length - 3} more
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">{entry.name}</h2>
                                <p className="text-gray-600">{new Date(entry.created_at).toLocaleString()}</p>
                                <p className="text-gray-600">{entry.photos.length} photo{entry.photos.length > 1 ? 's' : ''}</p>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}