// src/components/tokens/goblin/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/goblin.png?url';

export type GoblinTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function GoblinToken(props: GoblinTokenProps) {
    return (
        <Token
            name='Goblin'
            image={iconSrc}
            {...props}
        />
    );
}

export default GoblinToken;
