// src/components/tokens/soldier/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/soldier.png?url';

export type SoldierTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function SoldierToken(props: SoldierTokenProps) {
    return (
        <Token
            name='Soldier'
            image={iconSrc}
            {...props}
        />
    );
}

export default SoldierToken;
