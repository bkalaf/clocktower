// src/components/tokens/virgin/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/virgin.png?url';

export type VirginTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function VirginToken(props: VirginTokenProps) {
    return <Token name='Virgin' image={iconSrc} {...props} />;
}

export default VirginToken;

