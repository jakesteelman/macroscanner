import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { updateName } from '@/actions/auth';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';

export default function ProfileForm({ userName }: { userName: string }) {
    return (
        <Card>
            <form id="profileForm">
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription >
                        Update your profile here. Your profile is not visible to other Macroscanner users.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            type="text"
                            name="fullName"
                            defaultValue={userName}
                            placeholder="Your name"
                            maxLength={64}
                        />
                    </div>
                </CardContent>
                <CardFooter className='border-t pt-6'>
                    <Button
                        type="submit"
                        form="nameForm"
                        formAction={updateName}
                    >
                        Update Profile
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}