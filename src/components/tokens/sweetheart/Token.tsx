// src/components/tokens/sweetheart/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/sweetheart.png?url';

export type SweetheartTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function SweetheartToken(props: SweetheartTokenProps) {
    return (
        <Token
            name='Sweetheart'
            image={iconSrc}
            {...props}
        />
    );
}

export default SweetheartToken;
