// src/components/tokens/revolutionary/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/revolutionary.png?url';

export type RevolutionaryTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function RevolutionaryToken(props: RevolutionaryTokenProps) {
    return (
        <Token
            name='Revolutionary'
            image={iconSrc}
            {...props}
        />
    );
}

export default RevolutionaryToken;
