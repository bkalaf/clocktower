// src/components/tokens/chambermaid/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/chambermaid.png?url';

export type ChambermaidTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function ChambermaidToken(props: ChambermaidTokenProps) {
    return (
        <Token
            name='Chambermaid'
            image={iconSrc}
            {...props}
        />
    );
}

export default ChambermaidToken;
