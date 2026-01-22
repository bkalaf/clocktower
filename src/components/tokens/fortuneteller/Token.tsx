// src/components/tokens/fortuneteller/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/fortuneteller.png?url';

export type FortunetellerTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function FortunetellerToken(props: FortunetellerTokenProps) {
    return (
        <Token
            name='Fortune Teller'
            image={iconSrc}
            {...props}
        />
    );
}

export default FortunetellerToken;
