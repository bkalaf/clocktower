// src/components/tokens/boomdandy/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/boomdandy.png?url';

export type BoomdandyTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function BoomdandyToken(props: BoomdandyTokenProps) {
    return (
        <Token
            name='Boomdandy'
            image={iconSrc}
            {...props}
        />
    );
}

export default BoomdandyToken;
