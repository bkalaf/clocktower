// src/components/UserNameSpan.tsx

export function UserNameSpan({ username }: { username?: string }) {
    return (
        username && (
            <span className='hidden truncate text-sm font-semibold uppercase tracking-wide text-slate-200 md:inline-flex'>
                {username}
            </span>
        )
    );
}
