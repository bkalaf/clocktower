// src/components/tokens/klutz/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/klutz.png?url';

export type KlutzTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function KlutzToken(props: KlutzTokenProps) {
    return (
        <Token
            name='Klutz'
            image={iconSrc}
            {...props}
        />
    );
}

export default KlutzToken;
