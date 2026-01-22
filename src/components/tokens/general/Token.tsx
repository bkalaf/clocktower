// src/components/tokens/general/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/general.png?url';

export type GeneralTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function GeneralToken(props: GeneralTokenProps) {
    return (
        <Token
            name='General'
            image={iconSrc}
            {...props}
        />
    );
}

export default GeneralToken;
