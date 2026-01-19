// src/components/tokens/barista/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/barista.png?url';

export type BaristaTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function BaristaToken(props: BaristaTokenProps) {
    return <Token name='Barista' image={iconSrc} {...props} />;
}

export default BaristaToken;

