// src/components/header/LogoutDialog.tsx
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WHOAMI_QUERY_KEY } from '@/hooks/useAuthUser';
import { dialogBackgroundClassName, dialogBackgroundStyle } from './dialogBackground';

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
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    onClose();
                }
            }}
        >
            <DialogContent
                className={dialogBackgroundClassName}
                style={dialogBackgroundStyle}
            >
                <DialogHeader>
                    <DialogTitle className='text-white'>Confirm logout</DialogTitle>
                    <DialogDescription className='text-white/80'>
                        You will need to log back in to continue.
                    </DialogDescription>
                </DialogHeader>
                <p className='text-sm text-white/80'>
                    Are you sure you want to log out? This will clear your local session and sign you out on the server.
                </p>
                <DialogFooter className='mt-4 flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
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
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
