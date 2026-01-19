const legendItems = [
    {
        id: 'demon-evil',
        label: 'Demon / Evil',
        color: 'bg-red-500'
    },
    {
        id: 'townsfolk-blue',
        label: 'Townsfolk / Blue',
        color: 'bg-blue-500'
    },
    {
        id: 'minions',
        label: 'Minions',
        color: 'bg-orange-500'
    },
    {
        id: 'outsiders',
        label: 'Outsiders',
        color: 'bg-cyan-400'
    },
    {
        id: 'travelers-misregisters',
        label: 'Travelers + Misregisters (Recluse, Spy)',
        color: 'bg-yellow-400'
    }
];

export function BottomBarLegend() {
    return (
        <div className='border-t border-border/60 bg-background/95'>
            <div className='mx-auto flex max-w-screen-sm flex-wrap items-center justify-center gap-3 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground'>
                {legendItems.map((item) => (
                    <span
                        key={item.id}
                        className='flex items-center gap-1.5'
                    >
                        <span className={`h-2 w-2 rounded-full ${item.color}`} />
                        {item.label}
                    </span>
                ))}
            </div>
        </div>
    );
}
