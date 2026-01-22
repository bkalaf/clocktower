// src/components/tokens/witch/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/witch.png?url';

export type WitchTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function WitchToken(props: WitchTokenProps) {
    return (
        <Token
            name='Witch'
            image={iconSrc}
            {...props}
        />
    );
}

export default WitchToken;
