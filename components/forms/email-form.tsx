import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { updateEmail } from '@/actions/auth';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';

export default function EmailForm({ userEmail }: { userEmail: string }) {
    return (
        <Card>
            <form id="emailForm">
                <CardHeader>
                    <CardTitle>Email Address</CardTitle>
                    <CardDescription>
                        Update your email address. You'll need to verify your new email before the change takes effect.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            name="email"
                            // defaultValue={userEmail}
                            placeholder={userEmail}
                        />
                    </div>
                </CardContent>
                <CardFooter className='border-t pt-6'>
                    <Button
                        type="submit"
                        formAction={updateEmail}
                    >
                        Update Email
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
