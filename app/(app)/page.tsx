import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-12">
            <h1 className="text-6xl font-medium tracking-tight">Journal</h1>
        </div>
    );
}
