// src/components/tokens/empath/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/empath.png?url';

export type EmpathTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function EmpathToken(props: EmpathTokenProps) {
    return <Token name='Empath' image={iconSrc} {...props} />;
}

export default EmpathToken;

