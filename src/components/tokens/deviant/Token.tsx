// src/components/tokens/deviant/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/deviant.png?url';

export type DeviantTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function DeviantToken(props: DeviantTokenProps) {
    return (
        <Token
            name='Deviant'
            image={iconSrc}
            {...props}
        />
    );
}

export default DeviantToken;
