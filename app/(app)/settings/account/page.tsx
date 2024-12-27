import { signOutAction } from "@/actions/auth";
import { getUser } from "@/actions/user";
import ProfileForm from "@/components/forms/profile-form";
import EmailForm from "@/components/forms/email-form";
import PasswordForm from "@/components/forms/password-form";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import FormMessage, { Message } from "@/components/form-message";

export default async function AccountPage(props: {
    searchParams: Promise<Message>;
}) {
    const user = await getUser();
    const message = (await props.searchParams);

    if (!user || !user.email) {
        return redirect("/sign-in");
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <FormMessage message={message} />
            <ProfileForm userName={user.user_metadata.full_name} />
            <EmailForm userEmail={user.email} />
            <PasswordForm />
        </div>
    );
}
