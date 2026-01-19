// src/components/overlays/OverlayElement.tsx

export function OverlayElement({
    stateSelector,
    oppositeSelector,
    pseudoSelector
}: {
    stateSelector: string;
    oppositeSelector: string;
    pseudoSelector: string;
}) {
    const cn = [
        oppositeSelector,
        pseudoSelector,
        stateSelector,
        'absolute inset-0 h-full w-full rounded-full z-10  border-0 ring-0 outline-0'
    ].join(' ');
    return <div className={cn} />;
}
