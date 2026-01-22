// src/components/tokens/dreamer/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/dreamer.png?url';

export type DreamerTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function DreamerToken(props: DreamerTokenProps) {
    return (
        <Token
            name='Dreamer'
            image={iconSrc}
            {...props}
        />
    );
}

export default DreamerToken;
