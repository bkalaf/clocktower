// src/components/tokens/noble/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/noble.png?url';

export type NobleTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function NobleToken(props: NobleTokenProps) {
    return <Token name='Noble' image={iconSrc} {...props} />;
}

export default NobleToken;

