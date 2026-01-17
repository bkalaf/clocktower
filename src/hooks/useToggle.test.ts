// src/hooks/useToggle.test.ts
import { renderHook, act } from '@testing-library/react';

import { useToggle } from './useToggle';

describe('useToggle', () => {
    it('manages the boolean state', () => {
        const { result } = renderHook(() => useToggle());

        expect(result.current.value).toBe(false);

        act(() => result.current.open());
        expect(result.current.value).toBe(true);

        act(() => result.current.toggle());
        expect(result.current.value).toBe(false);

        act(() => result.current.close());
        expect(result.current.value).toBe(false);
    });

    it('accepts an initial value', () => {
        const { result } = renderHook(() => useToggle(true));
        expect(result.current.value).toBe(true);
    });
});
