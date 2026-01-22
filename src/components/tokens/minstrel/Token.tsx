// src/components/tokens/minstrel/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/minstrel.png?url';

export type MinstrelTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function MinstrelToken(props: MinstrelTokenProps) {
    return (
        <Token
            name='Minstrel'
            image={iconSrc}
            {...props}
        />
    );
}

export default MinstrelToken;
