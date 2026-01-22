// src/components/tokens/mathematician/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/mathematician.png?url';

export type MathematicianTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function MathematicianToken(props: MathematicianTokenProps) {
    return (
        <Token
            name='Mathematician'
            image={iconSrc}
            {...props}
        />
    );
}

export default MathematicianToken;
