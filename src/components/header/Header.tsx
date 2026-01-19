// src/components/header/Header.tsx
import { useCallback, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { TopBar } from './TopBar';
import { NavigationDrawer } from './NavigationDrawer';
import { useAuth } from '@/state/useAuth';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, loading: isAuthLoading, logoutAndClear } = useAuth();
    const navigate = useNavigate();

    const handleLogout = useCallback(async () => {
        await logoutAndClear();
        navigate({ to: '/', replace: true });
    }, [logoutAndClear, navigate]);

    return (
        <>
            <TopBar
                user={user}
                isAuthLoading={isAuthLoading}
                onMenuOpen={() => setMenuOpen(true)}
                onLogout={handleLogout}
            />
            <NavigationDrawer
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
            />
        </>
    );
}
