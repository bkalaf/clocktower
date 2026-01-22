// src/components/tokens/scapegoat/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/scapegoat.png?url';

export type ScapegoatTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function ScapegoatToken(props: ScapegoatTokenProps) {
    return (
        <Token
            name='Scapegoat'
            image={iconSrc}
            {...props}
        />
    );
}

export default ScapegoatToken;
