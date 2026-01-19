// src/components/tokens/slayer/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/slayer.png?url';

export type SlayerTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function SlayerToken(props: SlayerTokenProps) {
    return <Token name='Slayer' image={iconSrc} {...props} />;
}

export default SlayerToken;

