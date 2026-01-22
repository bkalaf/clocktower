// src/components/tokens/engineer/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/engineer.png?url';

export type EngineerTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function EngineerToken(props: EngineerTokenProps) {
    return (
        <Token
            name='Engineer'
            image={iconSrc}
            {...props}
        />
    );
}

export default EngineerToken;
