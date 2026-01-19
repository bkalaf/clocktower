// src/components/tokens/monk/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/monk.png?url';

export type MonkTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function MonkToken(props: MonkTokenProps) {
    return <Token name='Monk' image={iconSrc} {...props} />;
}

export default MonkToken;

