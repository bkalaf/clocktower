// src/components/tokens/investigator/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/investigator.png?url';

export type InvestigatorTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function InvestigatorToken(props: InvestigatorTokenProps) {
    return <Token name='Investigator' image={iconSrc} {...props} />;
}

export default InvestigatorToken;

