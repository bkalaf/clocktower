// src/components/tokens/imp/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/imp.png?url';

export type ImpTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function ImpToken(props: ImpTokenProps) {
    return <Token name='Imp' image={iconSrc} {...props} />;
}

export default ImpToken;

