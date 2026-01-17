// src/components/header/dialogBackground.ts
import type { CSSProperties } from 'react';

import neptunePool from '@/assets/images/neptune-pool.png';

export const dialogBackgroundClassName = 'bg-transparent text-white';

export const dialogBackgroundStyle: CSSProperties = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${neptunePool})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
};
