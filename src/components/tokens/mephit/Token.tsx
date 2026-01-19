// src/components/tokens/mephit/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/mephit.png?url';

export type MephitTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function MephitToken(props: MephitTokenProps) {
    return <Token name='Mephit' image={iconSrc} {...props} />;
}

export default MephitToken;

