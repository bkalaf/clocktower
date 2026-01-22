// src/components/tokens/shabaloth/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/shabaloth.png?url';

export type ShabalothTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function ShabalothToken(props: ShabalothTokenProps) {
    return (
        <Token
            name='Shabaloth'
            image={iconSrc}
            {...props}
        />
    );
}

export default ShabalothToken;
