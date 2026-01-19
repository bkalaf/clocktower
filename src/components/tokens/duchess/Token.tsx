// src/components/tokens/duchess/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/duchess.png?url';

export type DuchessTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function DuchessToken(props: DuchessTokenProps) {
    return <Token name='Duchess' image={iconSrc} {...props} />;
}

export default DuchessToken;

