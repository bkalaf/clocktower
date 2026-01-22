// src/components/tokens/fiddler/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/fiddler.png?url';

export type FiddlerTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function FiddlerToken(props: FiddlerTokenProps) {
    return (
        <Token
            name='Fiddler'
            image={iconSrc}
            {...props}
        />
    );
}

export default FiddlerToken;
