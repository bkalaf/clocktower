// src/components/tokens/lilmonsta/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/lilmonsta.png?url';

export type LilmonstaTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function LilmonstaToken(props: LilmonstaTokenProps) {
    return <Token name='Lil' Monsta' image={iconSrc} {...props} />;
}

export default LilmonstaToken;

