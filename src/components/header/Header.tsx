// src/components/header/Header.tsx
import { useMemo, useState } from 'react';

import { useAuthUser } from '@/hooks/useAuthUser';
import { useDialogToggler } from '@/hooks/useDialogToggler';

import { TopBar } from './TopBar';
import { NavigationDrawer } from './NavigationDrawer';
import { LoginDialog } from './LoginDialog';
import { RegisterDialog } from './RegisterDialog';
import { LogoutDialog } from './LogoutDialog';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const loginDialog = useDialogToggler();
    const registerDialog = useDialogToggler();
    const logoutDialog = useDialogToggler();
    const { user, isLoading: isAuthLoading } = useAuthUser();
    return (
        <>
            <TopBar
                user={user}
                isAuthLoading={isAuthLoading}
                onMenuOpen={() => setMenuOpen(true)}
                onOpenLogin={loginDialog.open}
                onOpenRegister={registerDialog.open}
                onOpenLogout={logoutDialog.open}
            />
            <NavigationDrawer
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
            />
            <LoginDialog
                open={loginDialog.isOpen}
                onClose={loginDialog.close}
            />
            <RegisterDialog
                open={registerDialog.isOpen}
                onClose={registerDialog.close}
            />
            <LogoutDialog
                open={logoutDialog.isOpen}
                onClose={logoutDialog.close}
            />
        </>
    );
}
