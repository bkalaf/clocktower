// src/components/tokens/mastermind/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/mastermind.png?url';

export type MastermindTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function MastermindToken(props: MastermindTokenProps) {
    return (
        <Token
            name='Mastermind'
            image={iconSrc}
            {...props}
        />
    );
}

export default MastermindToken;
