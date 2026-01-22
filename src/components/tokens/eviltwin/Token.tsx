// src/components/tokens/eviltwin/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/eviltwin.png?url';

export type EviltwinTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function EviltwinToken(props: EviltwinTokenProps) {
    return (
        <Token
            name='Evil Twin'
            image={iconSrc}
            {...props}
        />
    );
}

export default EviltwinToken;
