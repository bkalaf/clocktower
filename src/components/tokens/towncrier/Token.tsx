// src/components/tokens/towncrier/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/towncrier.png?url';

export type TowncrierTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function TowncrierToken(props: TowncrierTokenProps) {
    return (
        <Token
            name='Town Crier'
            image={iconSrc}
            {...props}
        />
    );
}

export default TowncrierToken;
