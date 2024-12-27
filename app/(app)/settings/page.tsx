import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage(props: {
    searchParams: Promise<any>;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Edit your preferences and change how the app works.</CardDescription>
            </CardHeader>
            <CardContent>

            </CardContent>
        </Card>
    );
}
