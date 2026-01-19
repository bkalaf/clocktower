// src/components/header/Header.test.tsx
import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { TopBar } from './TopBar';

const navigateMock = jest.fn();

jest.mock('@tanstack/react-router', () => ({
    Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
    useNavigate: () => navigateMock,
    useLocation: () => ({
        current: {
            pathname: '/current',
            search: '?q=123'
        }
    })
}));

describe('TopBar', () => {
    beforeEach(() => {
        navigateMock.mockReset();
    });

    it('shows login/register when anonymous', () => {
        render(
            <TopBar
                user={null}
                isAuthLoading={false}
                onMenuOpen={jest.fn()}
                onLogout={jest.fn()}
            />
        );

        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    it('navigates to login with returnTo query', () => {
        render(
            <TopBar
                user={null}
                isAuthLoading={false}
                onMenuOpen={jest.fn()}
                onLogout={jest.fn()}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        expect(navigateMock).toHaveBeenCalledWith({
            to: '/login',
            search: { returnTo: '/current?q=123' }
        });
    });

    it('navigates to register when register button clicked', () => {
        render(
            <TopBar
                user={null}
                isAuthLoading={false}
                onMenuOpen={jest.fn()}
                onLogout={jest.fn()}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        expect(navigateMock).toHaveBeenCalledWith({
            to: '/register',
            search: { returnTo: '/current?q=123' }
        });
    });

    it('shows user name when authed', () => {
        render(
            <TopBar
                user={{
                    _id: 'user:1',
                    name: 'Tester',
                    email: 'test@example.com',
                    userRoles: ['user']
                }}
                isAuthLoading={false}
                onMenuOpen={jest.fn()}
                onLogout={jest.fn()}
            />
        );

        expect(screen.getByText('Tester')).toBeInTheDocument();
    });
});
