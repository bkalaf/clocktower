// src/components/tokens/cultleader/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/cultleader.png?url';

export type CultleaderTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function CultleaderToken(props: CultleaderTokenProps) {
    return <Token name='Cult Leader' image={iconSrc} {...props} />;
}

export default CultleaderToken;

