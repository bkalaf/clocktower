// src/components/tokens/angel/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/angel.png?url';

export type AngelTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function AngelToken(props: AngelTokenProps) {
    return <Token name='Angel' image={iconSrc} {...props} />;
}

export default AngelToken;

