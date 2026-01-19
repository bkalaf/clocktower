// src/components/tokens/vigormortis/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/vigormortis.png?url';

export type VigormortisTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function VigormortisToken(props: VigormortisTokenProps) {
    return <Token name='Vigormortis' image={iconSrc} {...props} />;
}

export default VigormortisToken;

