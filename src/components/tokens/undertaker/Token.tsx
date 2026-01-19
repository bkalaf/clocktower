// src/components/tokens/undertaker/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/undertaker.png?url';

export type UndertakerTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function UndertakerToken(props: UndertakerTokenProps) {
    return <Token name='Undertaker' image={iconSrc} {...props} />;
}

export default UndertakerToken;

