// src/components/tokens/flowergirl/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/flowergirl.png?url';

export type FlowergirlTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function FlowergirlToken(props: FlowergirlTokenProps) {
    return (
        <Token
            name='Flowergirl'
            image={iconSrc}
            {...props}
        />
    );
}

export default FlowergirlToken;
