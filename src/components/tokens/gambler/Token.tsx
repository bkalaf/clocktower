// src/components/tokens/gambler/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/gambler.png?url';

export type GamblerTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function GamblerToken(props: GamblerTokenProps) {
    return (
        <Token
            name='Gambler'
            image={iconSrc}
            {...props}
        />
    );
}

export default GamblerToken;
