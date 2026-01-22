// src/components/tokens/gunslinger/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/gunslinger.png?url';

export type GunslingerTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function GunslingerToken(props: GunslingerTokenProps) {
    return (
        <Token
            name='Gunslinger'
            image={iconSrc}
            {...props}
        />
    );
}

export default GunslingerToken;
