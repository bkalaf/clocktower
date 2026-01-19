// src/components/tokens/heretic/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/heretic.png?url';

export type HereticTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function HereticToken(props: HereticTokenProps) {
    return <Token name='Heretic' image={iconSrc} {...props} />;
}

export default HereticToken;

