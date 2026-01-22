// src/components/tokens/fanggu/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/fanggu.png?url';

export type FangguTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function FangguToken(props: FangguTokenProps) {
    return (
        <Token
            name='Fang Gu'
            image={iconSrc}
            {...props}
        />
    );
}

export default FangguToken;
