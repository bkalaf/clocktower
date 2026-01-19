// src/components/tokens/widow/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/widow.png?url';

export type WidowTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function WidowToken(props: WidowTokenProps) {
    return <Token name='Widow' image={iconSrc} {...props} />;
}

export default WidowToken;

