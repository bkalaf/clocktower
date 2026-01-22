// src/components/tokens/doomsayer/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/doomsayer.png?url';

export type DoomsayerTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function DoomsayerToken(props: DoomsayerTokenProps) {
    return (
        <Token
            name='Doomsayer'
            image={iconSrc}
            {...props}
        />
    );
}

export default DoomsayerToken;
