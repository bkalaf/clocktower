// src/components/tokens/goon/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/goon.png?url';

export type GoonTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function GoonToken(props: GoonTokenProps) {
    return <Token name='Goon' image={iconSrc} {...props} />;
}

export default GoonToken;

