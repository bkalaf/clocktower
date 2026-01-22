// src/components/tokens/fisherman/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/fisherman.png?url';

export type FishermanTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function FishermanToken(props: FishermanTokenProps) {
    return (
        <Token
            name='Fisherman'
            image={iconSrc}
            {...props}
        />
    );
}

export default FishermanToken;
