// src/components/tokens/buddhist/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/buddhist.png?url';

export type BuddhistTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function BuddhistToken(props: BuddhistTokenProps) {
    return (
        <Token
            name='Buddhist'
            image={iconSrc}
            {...props}
        />
    );
}

export default BuddhistToken;
