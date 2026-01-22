// src/components/tokens/snitch/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/snitch.png?url';

export type SnitchTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function SnitchToken(props: SnitchTokenProps) {
    return (
        <Token
            name='Snitch'
            image={iconSrc}
            {...props}
        />
    );
}

export default SnitchToken;
