// src/components/tokens/seamstress/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/seamstress.png?url';

export type SeamstressTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function SeamstressToken(props: SeamstressTokenProps) {
    return (
        <Token
            name='Seamstress'
            image={iconSrc}
            {...props}
        />
    );
}

export default SeamstressToken;
