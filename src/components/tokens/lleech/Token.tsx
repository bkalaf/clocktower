// src/components/tokens/lleech/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/lleech.png?url';

export type LleechTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function LleechToken(props: LleechTokenProps) {
    return (
        <Token
            name='Lleech'
            image={iconSrc}
            {...props}
        />
    );
}

export default LleechToken;
