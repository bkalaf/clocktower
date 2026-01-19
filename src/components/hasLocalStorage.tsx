// src/components/hasLocalStorage.tsx
import { hasWindow } from './hasWindow';

export function hasLocalStorage(): boolean {
    try {
        return hasWindow() && 'localStorage' in window;
    } catch (error) {
        return false;
    }
}
