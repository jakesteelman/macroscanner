import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { updatePassword } from '@/actions/auth';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';

export default function PasswordForm() {
    return (
        <Card>
            <form id="passwordForm">
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                        Update your password. Choose a strong password that you haven't used before.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                type="password"
                                name="password"
                                placeholder="New password"
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm new password"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className='border-t pt-6'>
                    <Button
                        type="submit"
                        formAction={updatePassword}
                    >
                        Update Password
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
