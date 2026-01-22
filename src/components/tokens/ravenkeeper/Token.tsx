// src/components/tokens/ravenkeeper/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/ravenkeeper.png?url';

export type RavenkeeperTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function RavenkeeperToken(props: RavenkeeperTokenProps) {
    return (
        <Token
            name='Ravenkeeper'
            image={iconSrc}
            {...props}
        />
    );
}

export default RavenkeeperToken;
