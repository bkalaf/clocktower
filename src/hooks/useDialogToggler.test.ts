// src/hooks/useDialogToggler.test.ts
import { renderHook, act } from '@testing-library/react';

import { useDialogToggler } from './useDialogToggler';

describe('useDialogToggler', () => {
    it('exposes open/close/toggle helpers', () => {
        const { result } = renderHook(() => useDialogToggler());

        expect(result.current.isOpen).toBe(false);

        act(() => result.current.open());
        expect(result.current.isOpen).toBe(true);

        act(() => result.current.toggle());
        expect(result.current.isOpen).toBe(false);

        act(() => result.current.close());
        expect(result.current.isOpen).toBe(false);
    });

    it('can start open', () => {
        const { result } = renderHook(() => useDialogToggler(true));
        expect(result.current.isOpen).toBe(true);
    });
});
