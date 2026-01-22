// src/components/tokens/butler/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/butler.png?url';

export type ButlerTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function ButlerToken(props: ButlerTokenProps) {
    return (
        <Token
            name='Butler'
            image={iconSrc}
            {...props}
        />
    );
}

export default ButlerToken;
