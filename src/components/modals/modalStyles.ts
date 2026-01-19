// src/components/modals/modalStyles.ts
import type { CSSProperties } from 'react';
import neptunePool from '@/assets/images/neptune-pool.png?url';

export const modalBackgroundStyle: CSSProperties = {
    backgroundImage: `url(${neptunePool})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
};
