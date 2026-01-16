// src/components/Header.tsx
import { Link } from '@tanstack/react-router';

import { useEffect, useId, useState, type ReactNode } from 'react';
import {
    ChevronDown,
    ChevronRight,
    Home,
    LogIn,
    LogOut,
    Menu,
    Network,
    StickyNote,
    User,
    UserPlus,
    X
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [groupedExpanded, setGroupedExpanded] = useState<Record<string, boolean>>({});
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [registerForm, setRegisterForm] = useState({
        name: '',
        email: '',
        password: '',
        verificationPassword: ''
    });
    const [loginError, setLoginError] = useState<string | null>(null);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [loginLoading, setLoginLoading] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const queryClient = useQueryClient();
    const whoamiQuery = useQuery({
        queryKey: ['whoami'],
        queryFn: async () => {
            const response = await fetch('/api/whoami', { credentials: 'include' });
            if (!response.ok) {
                throw new Error('Unable to load session');
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    });
    const user = whoamiQuery.data?.user ?? null;

    return (
        <>
            <header className='p-4 flex items-center justify-between bg-gray-900 text-white shadow-lg'>
                <div className='flex items-center gap-4'>
                    <button
                        onClick={() => setIsOpen(true)}
                        className='p-2 hover:bg-gray-800 rounded-lg transition-colors'
                        aria-label='Open menu'
                    >
                        <Menu size={24} />
                    </button>
                    <Link to='/' className='flex items-center gap-3'>
                        <img
                            src='/tanstack-word-logo-white.svg'
                            alt='TanStack Logo'
                            className='h-10'
                        />
                        <h1 className='text-xl font-semibold text-white hidden md:block'>Start</h1>
                    </Link>
                </div>
                <div className='flex items-center gap-3'>
                    {!user && whoamiQuery.isLoading ? (
                        <span className='text-sm text-gray-300'>Checking session…</span>
                    ) : null}
                    {user ? (
                        <>
                            <button
                                onClick={() => setIsLogoutOpen(true)}
                                className='flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-900 font-semibold border border-transparent shadow-sm shadow-white/20 hover:bg-slate-100 transition'
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                            <div className='flex flex-col items-center'>
                                <div className='h-12 w-12 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center shadow-inner'>
                                    <User size={24} />
                                </div>
                                <span className='text-xs text-gray-300 mt-1 text-center'>{user.name}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsLoginOpen(true)}
                                className='flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-900 font-semibold border border-transparent shadow-sm shadow-white/20 hover:bg-slate-100 transition'
                            >
                                <LogIn size={16} />
                                Login
                            </button>
                            <button
                                onClick={() => setIsRegisterOpen(true)}
                                className='flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/40 hover:from-cyan-400 hover:to-blue-400 transition'
                            >
                                <UserPlus size={16} />
                                Register
                            </button>
                        </>
                    )}
                </div>
            </header>

            <aside
                className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className='flex items-center justify-between p-4 border-b border-gray-700'>
                    <h2 className='text-xl font-bold'>Navigation</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className='p-2 hover:bg-gray-800 rounded-lg transition-colors'
                        aria-label='Close menu'
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className='flex-1 p-4 overflow-y-auto'>
                    <Link
                        to='/'
                        onClick={() => setIsOpen(false)}
                        className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2'
                        activeProps={{
                            className:
                                'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2'
                        }}
                    >
                        <Home size={20} />
                        <span className='font-medium'>Home</span>
                    </Link>

                    {/* Demo Links Start */}

                    <Link
                        to='/demo/start/api-request'
                        onClick={() => setIsOpen(false)}
                        className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2'
                        activeProps={{
                            className:
                                'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2'
                        }}
                    >
                        <Network size={20} />
                        <span className='font-medium'>Start - API Request</span>
                    </Link>

                    <div className='flex flex-row justify-between'>
                        <Link
                            to='/demo/start/ssr'
                            onClick={() => setIsOpen(false)}
                            className='flex-1 flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2'
                            activeProps={{
                                className:
                                    'flex-1 flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2'
                            }}
                        >
                            <StickyNote size={20} />
                            <span className='font-medium'>Start - SSR Demos</span>
                        </Link>
                        <button
                            className='p-2 hover:bg-gray-800 rounded-lg transition-colors'
                            onClick={() =>
                                setGroupedExpanded((prev) => ({
                                    ...prev,
                                    StartSSRDemo: !prev.StartSSRDemo
                                }))
                            }
                        >
                            {groupedExpanded.StartSSRDemo ? (
                                <ChevronDown size={20} />
                            ) : (
                                <ChevronRight size={20} />
                            )}
                        </button>
                    </div>
                    {groupedExpanded.StartSSRDemo && (
                        <div className='flex flex-col ml-4'>
                            <Link
                                to='/demo/start/ssr/spa-mode'
                                onClick={() => setIsOpen(false)}
                                className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2'
                                activeProps={{
                                    className:
                                        'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2'
                                }}
                            >
                                <StickyNote size={20} />
                                <span className='font-medium'>SPA Mode</span>
                            </Link>

                            <Link
                                to='/demo/start/ssr/full-ssr'
                                onClick={() => setIsOpen(false)}
                                className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2'
                                activeProps={{
                                    className:
                                        'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2'
                                }}
                            >
                                <StickyNote size={20} />
                                <span className='font-medium'>Full SSR</span>
                            </Link>

                            <Link
                                to='/demo/start/ssr/data-only'
                                onClick={() => setIsOpen(false)}
                                className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2'
                                activeProps={{
                                    className:
                                        'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2'
                                }}
                            >
                                <StickyNote size={20} />
                                <span className='font-medium'>Data Only</span>
                            </Link>
                        </div>
                    )}

                    <Link
                        to='/demo/tanstack-query'
                        onClick={() => setIsOpen(false)}
                        className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2'
                        activeProps={{
                            className:
                                'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2'
                        }}
                    >
                        <Network size={20} />
                        <span className='font-medium'>TanStack Query</span>
                    </Link>

                    {/* Demo Links End */}
                </nav>
            </aside>

            <Dialog
                open={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                title='Login'
                description='Enter your credentials to continue'
            >
                <form
                    className='space-y-4'
                    onSubmit={async (event) => {
                        event.preventDefault();
                        setLoginError(null);
                        setLoginLoading(true);
                        try {
                            const response = await fetch('/api/auth/login', {
                                method: 'POST',
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    email: loginForm.email,
                                    password: loginForm.password
                                })
                            });

                            if (!response.ok) {
                                const body = await response.json().catch(() => null);
                                setLoginError(body?.message ?? 'Login failed');
                                return;
                            }

                            await queryClient.invalidateQueries({ queryKey: ['whoami'] });
                            setLoginForm({ email: '', password: '' });
                            setIsLoginOpen(false);
                        } catch (error) {
                            setLoginError('Unable to log in');
                        } finally {
                            setLoginLoading(false);
                        }
                    }}
                >
                    <div className='space-y-1 text-sm'>
                        <label htmlFor='login-email' className='font-semibold text-gray-700'>
                            Email
                        </label>
                        <input
                            id='login-email'
                            type='email'
                            required
                            value={loginForm.email}
                            onChange={(event) =>
                                setLoginForm((prev) => ({ ...prev, email: event.target.value }))
                            }
                            autoComplete='email'
                            className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30'
                        />
                    </div>
                    <div className='space-y-1 text-sm'>
                        <label htmlFor='login-password' className='font-semibold text-gray-700'>
                            Password
                        </label>
                        <input
                            id='login-password'
                            type='password'
                            required
                            minLength={8}
                            value={loginForm.password}
                            onChange={(event) =>
                                setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                            }
                            autoComplete='current-password'
                            className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30'
                        />
                    </div>
                    {loginError && (
                        <p className='text-sm text-red-500'>{loginError}</p>
                    )}
                    <button
                        type='submit'
                        disabled={loginLoading}
                        className='w-full rounded-lg bg-slate-900 text-white px-4 py-2 font-semibold hover:bg-slate-800 transition disabled:opacity-60'
                    >
                        {loginLoading ? 'Logging in…' : 'Log in'}
                    </button>
                </form>
            </Dialog>

            <Dialog
                open={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                title='Create an account'
                description='We only ask for what we need'
            >
                <form
                    className='space-y-4'
                    onSubmit={async (event) => {
                        event.preventDefault();
                        setRegisterError(null);
                        if (registerForm.password !== registerForm.verificationPassword) {
                            setRegisterError('Passwords must match');
                            return;
                        }
                        setRegisterLoading(true);
                        try {
                            const response = await fetch('/api/auth/register', {
                                method: 'POST',
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    name: registerForm.name,
                                    email: registerForm.email,
                                    password: registerForm.password,
                                    verificationPassword: registerForm.verificationPassword
                                })
                            });

                            if (!response.ok) {
                                const body = await response.json().catch(() => null);
                                setRegisterError(body?.message ?? 'Registration failed');
                                return;
                            }

                            await queryClient.invalidateQueries({ queryKey: ['whoami'] });
                            setRegisterForm({
                                name: '',
                                email: '',
                                password: '',
                                verificationPassword: ''
                            });
                            setIsRegisterOpen(false);
                        } catch (error) {
                            setRegisterError('Unable to create account');
                        } finally {
                            setRegisterLoading(false);
                        }
                    }}
                >
                    <div className='space-y-1 text-sm'>
                        <label htmlFor='register-name' className='font-semibold text-gray-700'>
                            Full name
                        </label>
                        <input
                            id='register-name'
                            type='text'
                            required
                            value={registerForm.name}
                            onChange={(event) =>
                                setRegisterForm((prev) => ({ ...prev, name: event.target.value }))
                            }
                            autoComplete='name'
                            className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30'
                        />
                    </div>
                    <div className='space-y-1 text-sm'>
                        <label htmlFor='register-email' className='font-semibold text-gray-700'>
                            Email
                        </label>
                        <input
                            id='register-email'
                            type='email'
                            required
                            value={registerForm.email}
                            onChange={(event) =>
                                setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
                            }
                            autoComplete='email'
                            className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30'
                        />
                    </div>
                    <div className='space-y-1 text-sm'>
                        <label htmlFor='register-password' className='font-semibold text-gray-700'>
                            Password
                        </label>
                        <input
                            id='register-password'
                            type='password'
                            minLength={8}
                            required
                            value={registerForm.password}
                            onChange={(event) =>
                                setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
                            }
                            autoComplete='new-password'
                            className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30'
                        />
                    </div>
                    <div className='space-y-1 text-sm'>
                        <label
                            htmlFor='register-verification-password'
                            className='font-semibold text-gray-700'
                        >
                            Confirm password
                        </label>
                        <input
                            id='register-verification-password'
                            type='password'
                            minLength={8}
                            required
                            value={registerForm.verificationPassword}
                            onChange={(event) =>
                                setRegisterForm((prev) => ({
                                    ...prev,
                                    verificationPassword: event.target.value
                                }))
                            }
                            autoComplete='new-password'
                            className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30'
                        />
                    </div>
                    {registerError && (
                        <p className='text-sm text-red-500'>{registerError}</p>
                    )}
                    <button
                        type='submit'
                        disabled={registerLoading}
                        className='w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 font-semibold shadow-lg shadow-cyan-500/40 hover:from-cyan-400 hover:to-blue-400 transition disabled:opacity-60'
                    >
                        {registerLoading ? 'Registering…' : 'Register'}
                    </button>
                </form>
            </Dialog>

            <Dialog
                open={isLogoutOpen}
                onClose={() => setIsLogoutOpen(false)}
                title='Confirm logout'
                description='You will need to log back in to continue.'
            >
                <div className='space-y-4'>
                    <p className='text-sm text-gray-600'>
                        Are you sure you want to log out? This will clear your local session and sign you
                        out on the server.
                    </p>
                    <div className='flex justify-end gap-3'>
                        <button
                            type='button'
                            onClick={() => setIsLogoutOpen(false)}
                            className='px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold hover:border-gray-400 transition'
                        >
                            Cancel
                        </button>
                        <button
                            type='button'
                            onClick={async () => {
                                setLogoutLoading(true);
                                try {
                                    const response = await fetch('/api/auth/logout', {
                                        method: 'POST',
                                        credentials: 'include'
                                    });

                                    if (!response.ok) {
                                        throw new Error('Logout failed');
                                    }

                                    await queryClient.invalidateQueries({ queryKey: ['whoami'] });
                                    setIsLogoutOpen(false);
                                } catch (error) {
                                    console.error(error);
                                } finally {
                                    setLogoutLoading(false);
                                }
                            }}
                            disabled={logoutLoading}
                            className='px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition disabled:opacity-60'
                        >
                            {logoutLoading ? 'Logging out…' : 'Log out'}
                        </button>
                    </div>
                </div>
            </Dialog>
        </>
    );
}

type DialogProps = {
    open: boolean;
    title: string;
    description?: string;
    onClose: () => void;
    children: ReactNode;
};

function Dialog({ open, title, description, onClose, children }: DialogProps) {
    const titleId = useId();

    useEffect(() => {
        if (!open) return;

        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        };

        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
            <div
                className='fixed inset-0 bg-black/50 backdrop-blur-sm'
                onClick={onClose}
                aria-hidden='true'
            />
            <div
                role='dialog'
                aria-modal='true'
                aria-labelledby={titleId}
                className='relative z-10 w-full max-w-md rounded-2xl bg-white text-slate-900 shadow-2xl'
                onClick={(event) => event.stopPropagation()}
            >
                <div className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
                    <div>
                        <h3 id={titleId} className='text-lg font-semibold text-slate-900'>
                            {title}
                        </h3>
                        {description && (
                            <p className='text-sm text-gray-500'>{description}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className='p-2 rounded-full text-gray-500 hover:bg-gray-100 transition'
                        aria-label='Close dialog'
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className='px-6 py-6'>{children}</div>
            </div>
        </div>
    );
}
