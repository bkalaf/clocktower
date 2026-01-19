// src/components/tokens/mutant/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/mutant.png?url';

export type MutantTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function MutantToken(props: MutantTokenProps) {
    return <Token name='Mutant' image={iconSrc} {...props} />;
}

export default MutantToken;

