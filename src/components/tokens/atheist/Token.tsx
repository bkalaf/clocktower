// src/components/tokens/atheist/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/atheist.png?url';

export type AtheistTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function AtheistToken(props: AtheistTokenProps) {
    return (
        <Token
            name='Atheist'
            image={iconSrc}
            {...props}
        />
    );
}

export default AtheistToken;
