// src/components/tokens/psychopath/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/psychopath.png?url';

export type PsychopathTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function PsychopathToken(props: PsychopathTokenProps) {
    return (
        <Token
            name='Psychopath'
            image={iconSrc}
            {...props}
        />
    );
}

export default PsychopathToken;
