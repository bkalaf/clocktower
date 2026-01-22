// src/components/tokens/baron/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/baron.png?url';

export type BaronTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function BaronToken(props: BaronTokenProps) {
    return (
        <Token
            name='Baron'
            image={iconSrc}
            {...props}
        />
    );
}

export default BaronToken;
