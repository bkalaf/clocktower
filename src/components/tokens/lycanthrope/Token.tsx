// src/components/tokens/lycanthrope/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/lycanthrope.png?url';

export type LycanthropeTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function LycanthropeToken(props: LycanthropeTokenProps) {
    return <Token name='Lycanthrope' image={iconSrc} {...props} />;
}

export default LycanthropeToken;

