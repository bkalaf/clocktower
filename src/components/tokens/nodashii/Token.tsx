// src/components/tokens/nodashii/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/nodashii.png?url';

export type NodashiiTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function NodashiiToken(props: NodashiiTokenProps) {
    return (
        <Token
            name='No Dashii'
            image={iconSrc}
            {...props}
        />
    );
}

export default NodashiiToken;
