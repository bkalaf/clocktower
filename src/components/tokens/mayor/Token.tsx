// src/components/tokens/mayor/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/mayor.png?url';

export type MayorTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function MayorToken(props: MayorTokenProps) {
    return (
        <Token
            name='Mayor'
            image={iconSrc}
            {...props}
        />
    );
}

export default MayorToken;
