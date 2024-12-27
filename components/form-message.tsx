import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export type Message =
    | { success: string }
    | { error: string }
    | { message: string };

export default function FormMessage({ message }: { message: Message }) {
    const hasMessage = "message" in message || "error" in message || "success" in message;
    return hasMessage && (
        <div className="flex flex-col gap-2 w-full max-w-md text-sm">
            {"success" in message && (
                <Alert>
                    <CheckCircle2 className="h-4 w-4 !text-blue-500 dark:!text-blue-400" />
                    <AlertTitle className="tracking-normal">Success!</AlertTitle>
                    <AlertDescription className="text-muted-foreground">
                        {message.success}
                    </AlertDescription>
                </Alert>
            )}
            {"error" in message && (
                <Alert variant='destructive'>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle className="tracking-normal">Error!</AlertTitle>
                    <AlertDescription>
                        {message.error}
                    </AlertDescription>
                </Alert>
            )}
            {"message" in message && (
                <div className="text-foreground border-l-2 px-4">{message.message}</div>
            )}
        </div>
    );
}
