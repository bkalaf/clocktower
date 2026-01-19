// src/components/tokens/bureaucrat/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/bureaucrat.png?url';

export type BureaucratTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function BureaucratToken(props: BureaucratTokenProps) {
    return <Token name='Bureaucrat' image={iconSrc} {...props} />;
}

export default BureaucratToken;

