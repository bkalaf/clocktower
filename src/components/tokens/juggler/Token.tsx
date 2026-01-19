// src/components/tokens/juggler/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/juggler.png?url';

export type JugglerTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function JugglerToken(props: JugglerTokenProps) {
    return <Token name='Juggler' image={iconSrc} {...props} />;
}

export default JugglerToken;

