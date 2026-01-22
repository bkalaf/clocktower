// src/components/tokens/magician/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/magician.png?url';

export type MagicianTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function MagicianToken(props: MagicianTokenProps) {
    return (
        <Token
            name='Magician'
            image={iconSrc}
            {...props}
        />
    );
}

export default MagicianToken;
