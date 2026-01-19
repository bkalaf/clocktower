// src/components/tokens/fibbin/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/fibbin.png?url';

export type FibbinTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function FibbinToken(props: FibbinTokenProps) {
    return <Token name='Fibbin' image={iconSrc} {...props} />;
}

export default FibbinToken;

