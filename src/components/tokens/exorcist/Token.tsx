// src/components/tokens/exorcist/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/exorcist.png?url';

export type ExorcistTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function ExorcistToken(props: ExorcistTokenProps) {
    return <Token name='Exorcist' image={iconSrc} {...props} />;
}

export default ExorcistToken;

