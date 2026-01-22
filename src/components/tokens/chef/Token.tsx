// src/components/tokens/chef/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/chef.png?url';

export type ChefTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function ChefToken(props: ChefTokenProps) {
    return (
        <Token
            name='Chef'
            image={iconSrc}
            {...props}
        />
    );
}

export default ChefToken;
