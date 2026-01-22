// src/components/tokens/politician/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/politician.png?url';

export type PoliticianTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function PoliticianToken(props: PoliticianTokenProps) {
    return (
        <Token
            name='Politician'
            image={iconSrc}
            {...props}
        />
    );
}

export default PoliticianToken;
