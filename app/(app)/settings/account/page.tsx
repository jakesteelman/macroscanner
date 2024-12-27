import { signOutAction } from "@/actions/auth";
import { getUser } from "@/actions/user";
import ProfileForm from "@/components/forms/profile-form";
import { Button } from "@/components/ui/button";

export default async function AccountPage(props: {
    searchParams: Promise<any>;
}) {

    const user = await getUser();

    return (
        <div className="flex flex-col gap-4 w-full">
            <ProfileForm userName={user.user_metadata.full_name} />
            <form action={signOutAction}>
                <Button type="submit" variant={"outline"}>
                    Sign out
                </Button>
            </form>
        </div>
    );
}
