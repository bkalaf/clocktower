// src/components/tokens/damsel/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/damsel.png?url';

export type DamselTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function DamselToken(props: DamselTokenProps) {
    return (
        <Token
            name='Damsel'
            image={iconSrc}
            {...props}
        />
    );
}

export default DamselToken;
