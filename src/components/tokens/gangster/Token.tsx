// src/components/tokens/gangster/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/gangster.png?url';

export type GangsterTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function GangsterToken(props: GangsterTokenProps) {
    return (
        <Token
            name='Gangster'
            image={iconSrc}
            {...props}
        />
    );
}

export default GangsterToken;
