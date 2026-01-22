// src/components/tokens/spy/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/spy.png?url';

export type SpyTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function SpyToken(props: SpyTokenProps) {
    return (
        <Token
            name='Spy'
            image={iconSrc}
            {...props}
        />
    );
}

export default SpyToken;
