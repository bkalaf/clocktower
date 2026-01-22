// src/components/tokens/tealady/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/tealady.png?url';

export type TealadyTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function TealadyToken(props: TealadyTokenProps) {
    return (
        <Token
            name='Tea Lady'
            image={iconSrc}
            {...props}
        />
    );
}

export default TealadyToken;
