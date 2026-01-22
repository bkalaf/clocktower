// src/components/tokens/golem/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/golem.png?url';

export type GolemTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function GolemToken(props: GolemTokenProps) {
    return (
        <Token
            name='Golem'
            image={iconSrc}
            {...props}
        />
    );
}

export default GolemToken;
