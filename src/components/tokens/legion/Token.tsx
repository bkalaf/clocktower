// src/components/tokens/legion/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/legion.png?url';

export type LegionTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function LegionToken(props: LegionTokenProps) {
    return <Token name='Legion' image={iconSrc} {...props} />;
}

export default LegionToken;

