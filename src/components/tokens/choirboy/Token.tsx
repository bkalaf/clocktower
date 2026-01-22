// src/components/tokens/choirboy/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/choirboy.png?url';

export type ChoirboyTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function ChoirboyToken(props: ChoirboyTokenProps) {
    return (
        <Token
            name='Choirboy'
            image={iconSrc}
            {...props}
        />
    );
}

export default ChoirboyToken;
