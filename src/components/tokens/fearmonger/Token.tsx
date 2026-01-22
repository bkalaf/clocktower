// src/components/tokens/fearmonger/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/fearmonger.png?url';

export type FearmongerTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function FearmongerToken(props: FearmongerTokenProps) {
    return (
        <Token
            name='Fearmonger'
            image={iconSrc}
            {...props}
        />
    );
}

export default FearmongerToken;
