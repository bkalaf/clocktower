// src/components/tokens/sailor/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/sailor.png?url';

export type SailorTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function SailorToken(props: SailorTokenProps) {
    return (
        <Token
            name='Sailor'
            image={iconSrc}
            {...props}
        />
    );
}

export default SailorToken;
