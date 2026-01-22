// src/components/tokens/washerwoman/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/washerwoman.png?url';

export type WasherwomanTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function WasherwomanToken(props: WasherwomanTokenProps) {
    return (
        <Token
            name='Washerwoman'
            image={iconSrc}
            {...props}
        />
    );
}

export default WasherwomanToken;
