// src/components/tokens/butcher/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/butcher.png?url';

export type ButcherTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function ButcherToken(props: ButcherTokenProps) {
    return (
        <Token
            name='Butcher'
            image={iconSrc}
            {...props}
        />
    );
}

export default ButcherToken;
