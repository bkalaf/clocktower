// src/components/overlays/index.ts
//src/components/overlays/index.ts
import { atom } from 'recoil';
import { DialogResult } from '../../store/types/ui-types';

export const nightBreaksDialogResolver = atom({
    key: 'nightBreaksDialogResolver',
    default: async () => {}
});

export const dawnBreaksDialogResolver = atom({
    key: 'dawnBreaksDialogResolver',
    default: async () => {}
});

export const gameOverlayResolver = atom({
    key: 'gameOverlayResolver',
    default: async (result: DialogResult) => {}
});

export const timesUpDialogResolver = atom({
    key: 'timesUpDialogResolver',
    default: () => async () => {}
});
