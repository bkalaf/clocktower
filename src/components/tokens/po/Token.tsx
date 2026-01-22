// src/components/tokens/po/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/po.png?url';

export type PoTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function PoToken(props: PoTokenProps) {
    return (
        <Token
            name='Po'
            image={iconSrc}
            {...props}
        />
    );
}

export default PoToken;
