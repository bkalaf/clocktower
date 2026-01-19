// src/components/tokens/recluse/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/recluse.png?url';

export type RecluseTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function RecluseToken(props: RecluseTokenProps) {
    return <Token name='Recluse' image={iconSrc} {...props} />;
}

export default RecluseToken;

