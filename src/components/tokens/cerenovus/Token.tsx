// src/components/tokens/cerenovus/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/cerenovus.png?url';

export type CerenovusTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function CerenovusToken(props: CerenovusTokenProps) {
    return (
        <Token
            name='Cerenovus'
            image={iconSrc}
            {...props}
        />
    );
}

export default CerenovusToken;
