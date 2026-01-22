// src/components/tokens/riot/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/riot.png?url';

export type RiotTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function RiotToken(props: RiotTokenProps) {
    return (
        <Token
            name='Riot'
            image={iconSrc}
            {...props}
        />
    );
}

export default RiotToken;
