// src/components/tokens/beggar/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/beggar.png?url';

export type BeggarTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function BeggarToken(props: BeggarTokenProps) {
    return (
        <Token
            name='Beggar'
            image={iconSrc}
            {...props}
        />
    );
}

export default BeggarToken;
