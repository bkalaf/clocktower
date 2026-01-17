import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WHOAMI_QUERY_KEY } from '@/hooks/useAuthUser';

type LogoutDialogProps = {
    open: boolean;
    onClose: () => void;
};

export function LogoutDialog({ open, onClose }: LogoutDialogProps) {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            title='Confirm logout'
            description='You will need to log back in to continue.'
        >
            <div className='space-y-4'>
                <p className='text-sm text-gray-600'>
                    Are you sure you want to log out? This will clear your local session and sign you out on the server.
                </p>
                <div className='flex justify-end gap-3'>
                    <Button
                        variant='outline'
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='destructive'
                        onClick={async () => {
                            setIsLoading(true);
                            try {
                                const response = await fetch('/api/auth/logout', {
                                    method: 'POST',
                                    credentials: 'include'
                                });

                                if (!response.ok) {
                                    throw new Error('Logout failed');
                                }

                                await queryClient.invalidateQueries({ queryKey: WHOAMI_QUERY_KEY });
                                onClose();
                            } catch (error) {
                                console.error(error);
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging out…' : 'Log out'}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
