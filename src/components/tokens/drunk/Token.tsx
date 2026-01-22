// src/components/tokens/drunk/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/drunk.png?url';

export type DrunkTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function DrunkToken(props: DrunkTokenProps) {
    return (
        <Token
            name='Drunk'
            image={iconSrc}
            {...props}
        />
    );
}

export default DrunkToken;
