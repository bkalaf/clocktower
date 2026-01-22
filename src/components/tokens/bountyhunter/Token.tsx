// src/components/tokens/bountyhunter/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/bountyhunter.png?url';

export type BountyhunterTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function BountyhunterToken(props: BountyhunterTokenProps) {
    return (
        <Token
            name='Bounty Hunter'
            image={iconSrc}
            {...props}
        />
    );
}

export default BountyhunterToken;
