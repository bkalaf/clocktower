// src/components/tokens/stormcatcher/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/stormcatcher.png?url';

export type StormcatcherTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function StormcatcherToken(props: StormcatcherTokenProps) {
    return <Token name='Storm Catcher' image={iconSrc} {...props} />;
}

export default StormcatcherToken;

