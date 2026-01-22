// src/components/tokens/philosopher/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/philosopher.png?url';

export type PhilosopherTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function PhilosopherToken(props: PhilosopherTokenProps) {
    return (
        <Token
            name='Philosopher'
            image={iconSrc}
            {...props}
        />
    );
}

export default PhilosopherToken;
