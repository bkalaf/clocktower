// src/components/tokens/poppygrower/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/poppygrower.png?url';

export type PoppygrowerTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function PoppygrowerToken(props: PoppygrowerTokenProps) {
    return <Token name='Poppy Grower' image={iconSrc} {...props} />;
}

export default PoppygrowerToken;

