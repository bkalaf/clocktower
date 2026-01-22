// src/components/tokens/godfather/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/godfather.png?url';

export type GodfatherTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function GodfatherToken(props: GodfatherTokenProps) {
    return (
        <Token
            name='Godfather'
            image={iconSrc}
            {...props}
        />
    );
}

export default GodfatherToken;
