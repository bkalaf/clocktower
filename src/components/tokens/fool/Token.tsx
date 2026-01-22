// src/components/tokens/fool/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/fool.png?url';

export type FoolTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function FoolToken(props: FoolTokenProps) {
    return (
        <Token
            name='Fool'
            image={iconSrc}
            {...props}
        />
    );
}

export default FoolToken;
