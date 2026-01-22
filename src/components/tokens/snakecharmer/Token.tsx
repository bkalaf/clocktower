// src/components/tokens/snakecharmer/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/snakecharmer.png?url';

export type SnakecharmerTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function SnakecharmerToken(props: SnakecharmerTokenProps) {
    return (
        <Token
            name='Snake Charmer'
            image={iconSrc}
            {...props}
        />
    );
}

export default SnakecharmerToken;
