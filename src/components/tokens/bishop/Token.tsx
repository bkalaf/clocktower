// src/components/tokens/bishop/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/bishop.png?url';

export type BishopTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function BishopToken(props: BishopTokenProps) {
    return (
        <Token
            name='Bishop'
            image={iconSrc}
            {...props}
        />
    );
}

export default BishopToken;
