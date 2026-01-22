// src/components/tokens/spiritofivory/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/spiritofivory.png?url';

export type SpiritofivoryTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function SpiritofivoryToken(props: SpiritofivoryTokenProps) {
    return (
        <Token
            name='Spirit of Ivory'
            image={iconSrc}
            {...props}
        />
    );
}

export default SpiritofivoryToken;
