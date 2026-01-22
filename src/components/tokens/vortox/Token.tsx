// src/components/tokens/vortox/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/vortox.png?url';

export type VortoxTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function VortoxToken(props: VortoxTokenProps) {
    return (
        <Token
            name='Vortox'
            image={iconSrc}
            {...props}
        />
    );
}

export default VortoxToken;
