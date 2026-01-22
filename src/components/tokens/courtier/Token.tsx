// src/components/tokens/courtier/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/courtier.png?url';

export type CourtierTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function CourtierToken(props: CourtierTokenProps) {
    return (
        <Token
            name='Courtier'
            image={iconSrc}
            {...props}
        />
    );
}

export default CourtierToken;
