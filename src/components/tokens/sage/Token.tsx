// src/components/tokens/sage/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/sage.png?url';

export type SageTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function SageToken(props: SageTokenProps) {
    return <Token name='Sage' image={iconSrc} {...props} />;
}

export default SageToken;

