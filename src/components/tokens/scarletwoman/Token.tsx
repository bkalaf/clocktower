// src/components/tokens/scarletwoman/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/scarletwoman.png?url';

export type ScarletwomanTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function ScarletwomanToken(props: ScarletwomanTokenProps) {
    return (
        <Token
            name='Scarlet Woman'
            image={iconSrc}
            {...props}
        />
    );
}

export default ScarletwomanToken;
