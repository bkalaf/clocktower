// src/components/tokens/pixie/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/pixie.png?url';

export type PixieTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function PixieToken(props: PixieTokenProps) {
    return (
        <Token
            name='Pixie'
            image={iconSrc}
            {...props}
        />
    );
}

export default PixieToken;
