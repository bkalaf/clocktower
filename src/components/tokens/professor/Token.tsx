// src/components/tokens/professor/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/professor.png?url';

export type ProfessorTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function ProfessorToken(props: ProfessorTokenProps) {
    return (
        <Token
            name='Professor'
            image={iconSrc}
            {...props}
        />
    );
}

export default ProfessorToken;
