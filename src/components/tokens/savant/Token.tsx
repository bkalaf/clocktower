// src/components/tokens/savant/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/savant.png?url';

export type SavantTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function SavantToken(props: SavantTokenProps) {
    return (
        <Token
            name='Savant'
            image={iconSrc}
            {...props}
        />
    );
}

export default SavantToken;
