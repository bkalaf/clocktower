// src/components/tokens/alchemist/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/alchemist.png?url';

export type AlchemistTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function AlchemistToken(props: AlchemistTokenProps) {
    return (
        <Token
            name='Alchemist'
            image={iconSrc}
            {...props}
        />
    );
}

export default AlchemistToken;
