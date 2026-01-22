// src/components/tokens/clockmaker/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/clockmaker.png?url';

export type ClockmakerTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function ClockmakerToken(props: ClockmakerTokenProps) {
    return (
        <Token
            name='Clockmaker'
            image={iconSrc}
            {...props}
        />
    );
}

export default ClockmakerToken;
