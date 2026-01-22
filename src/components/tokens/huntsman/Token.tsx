// src/components/tokens/huntsman/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/huntsman.png?url';

export type HuntsmanTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function HuntsmanToken(props: HuntsmanTokenProps) {
    return (
        <Token
            name='Huntsman'
            image={iconSrc}
            {...props}
        />
    );
}

export default HuntsmanToken;
