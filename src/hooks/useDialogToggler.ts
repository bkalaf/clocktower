// src/hooks/useDialogToggler.ts
import { useToggle } from './useToggle';

export function useDialogToggler(initialValue = false) {
    const toggler = useToggle(initialValue);

    return {
        isOpen: toggler.value,
        open: toggler.open,
        close: toggler.close,
        toggle: toggler.toggle
    };
}
