// src/components/tokens/saint/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/saint.png?url';

export type SaintTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function SaintToken(props: SaintTokenProps) {
    return (
        <Token
            name='Saint'
            image={iconSrc}
            {...props}
        />
    );
}

export default SaintToken;
