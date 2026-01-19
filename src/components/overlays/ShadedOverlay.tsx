// src/components/overlays/ShadedOverlay.tsx
import { OverlayElement } from './OverlayElement';

// 'invisible data-[is-dead=true]:visible  bg-black/65 '
export const ShadedOverlay = () =>
    OverlayElement({
        oppositeSelector: 'invisible',
        pseudoSelector: 'group-data-[is-dead=true]:visible',
        stateSelector: 'bg-black/65'
    });
