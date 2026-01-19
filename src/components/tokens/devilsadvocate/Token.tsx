// src/components/tokens/devilsadvocate/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/devilsadvocate.png?url';

export type DevilsadvocateTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function DevilsadvocateToken(props: DevilsadvocateTokenProps) {
    return <Token name='Devil's Advocate' image={iconSrc} {...props} />;
}

export default DevilsadvocateToken;

