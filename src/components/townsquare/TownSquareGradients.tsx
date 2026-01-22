// src/components/townsquare/TownSquareGradients.tsx

const gradients = [
    ['demon', '#ce0100', '#000'],
    ['townsfolk', '#1f65ff', '#000'],
    ['default', '#4E4E4E', '#000']
];

export function TownSquareGradients() {
    return (
        <div className='pointer-events-none absolute inset-0 -z-10'>
            {gradients.map(([id, start, end]) => (
                <svg
                    key={id}
                    width='0'
                    height='0'
                >
                    <linearGradient
                        id={id}
                        x1='50%'
                        y1='100%'
                        x2='50%'
                        y2='0%'
                    >
                        <stop
                            offset='0%'
                            style={{ stopColor: end, stopOpacity: 1 }}
                        />
                        <stop
                            offset='100%'
                            style={{ stopColor: start, stopOpacity: 1 }}
                        />
                    </linearGradient>
                </svg>
            ))}
        </div>
    );
}
