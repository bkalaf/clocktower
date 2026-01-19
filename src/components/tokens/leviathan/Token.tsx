// src/components/tokens/leviathan/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/leviathan.png?url';

export type LeviathanTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function LeviathanToken(props: LeviathanTokenProps) {
    return <Token name='Leviathan' image={iconSrc} {...props} />;
}

export default LeviathanToken;

