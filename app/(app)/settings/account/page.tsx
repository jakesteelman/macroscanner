import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export default async function AccountPage(props: {
    searchParams: Promise<any>;
}) {
    return (
        <div>
            Account
            <form action={signOutAction}>
                <Button type="submit" variant={"outline"}>
                    Sign out
                </Button>
            </form>
        </div>
    );
}
