// src/components/tokens/king/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/king.png?url';

export type KingTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function KingToken(props: KingTokenProps) {
    return (
        <Token
            name='King'
            image={iconSrc}
            {...props}
        />
    );
}

export default KingToken;
