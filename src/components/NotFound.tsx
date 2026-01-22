// src/components/NotFound.tsx
import { Link } from '@tanstack/react-router';

export function NotFound() {
    return (
        <main className='flex min-h-screen flex-col items-center justify-center gap-4 px-3 text-center text-slate-600'>
            <p className='text-5xl font-semibold text-slate-900'>404</p>
            <p className='max-w-sm text-lg'>
                The page you were looking for could not be found. Try returning
                <Link to='/'>
                    <strong className='underline'>home</strong>
                </Link>
                .
            </p>
        </main>
    );
}
