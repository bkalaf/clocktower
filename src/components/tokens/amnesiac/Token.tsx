// src/components/tokens/amnesiac/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/amnesiac.png?url';

export type AmnesiacTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function AmnesiacToken(props: AmnesiacTokenProps) {
    return (
        <Token
            name='Amnesiac'
            image={iconSrc}
            {...props}
        />
    );
}

export default AmnesiacToken;
