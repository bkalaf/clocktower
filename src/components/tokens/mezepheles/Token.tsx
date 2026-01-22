// src/components/tokens/mezepheles/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/mezepheles.png?url';

export type MezephelesTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function MezephelesToken(props: MezephelesTokenProps) {
    return (
        <Token
            name='Mezepheles'
            image={iconSrc}
            {...props}
        />
    );
}

export default MezephelesToken;
