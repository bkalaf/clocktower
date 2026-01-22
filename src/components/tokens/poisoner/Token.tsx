// src/components/tokens/poisoner/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/poisoner.png?url';

export type PoisonerTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function PoisonerToken(props: PoisonerTokenProps) {
    return (
        <Token
            name='Poisoner'
            image={iconSrc}
            {...props}
        />
    );
}

export default PoisonerToken;
