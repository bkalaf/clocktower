// src/components/tokens/toymaker/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/toymaker.png?url';

export type ToymakerTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function ToymakerToken(props: ToymakerTokenProps) {
    return <Token name='Toymaker' image={iconSrc} {...props} />;
}

export default ToymakerToken;

