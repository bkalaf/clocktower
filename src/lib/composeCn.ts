import { cn } from '@/lib/utils';
import type { ClassValue } from 'clsx';
import { store } from '@/client/state/store';
import { themeSelectors } from '@/client/state/themeSlice';

/**
 * Helper that adds the current density gap class (from Redux) before merging with other classes via `cn`.
 */
export function composeCn(...otherClasses: ClassValue[]) {
    const densityGapClass = themeSelectors.selectDensityGapClass(store.getState().theme);
    return cn(densityGapClass, ...otherClasses);
}
