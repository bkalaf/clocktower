// src/components/tokens/marionette/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/marionette.png?url';

export type MarionetteTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function MarionetteToken(props: MarionetteTokenProps) {
    return (
        <Token
            name='Marionette'
            image={iconSrc}
            {...props}
        />
    );
}

export default MarionetteToken;
