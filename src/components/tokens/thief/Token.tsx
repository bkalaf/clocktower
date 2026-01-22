// src/components/tokens/thief/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/thief.png?url';

export type ThiefTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function ThiefToken(props: ThiefTokenProps) {
    return (
        <Token
            name='Thief'
            image={iconSrc}
            {...props}
        />
    );
}

export default ThiefToken;
