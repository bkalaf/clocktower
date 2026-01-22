// src/components/tokens/grandmother/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/grandmother.png?url';

export type GrandmotherTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function GrandmotherToken(props: GrandmotherTokenProps) {
    return (
        <Token
            name='Grandmother'
            image={iconSrc}
            {...props}
        />
    );
}

export default GrandmotherToken;
