// src/components/tokens/sentinel/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/sentinel.png?url';

export type SentinelTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function SentinelToken(props: SentinelTokenProps) {
    return (
        <Token
            name='Sentinel'
            image={iconSrc}
            {...props}
        />
    );
}

export default SentinelToken;
