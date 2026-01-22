// src/components/tokens/zombuul/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/zombuul.png?url';

export type ZombuulTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function ZombuulToken(props: ZombuulTokenProps) {
    return (
        <Token
            name='Zombuul'
            image={iconSrc}
            {...props}
        />
    );
}

export default ZombuulToken;
