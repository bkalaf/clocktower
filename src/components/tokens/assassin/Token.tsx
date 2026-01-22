// src/components/tokens/assassin/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/assassin.png?url';

export type AssassinTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function AssassinToken(props: AssassinTokenProps) {
    return (
        <Token
            name='Assassin'
            image={iconSrc}
            {...props}
        />
    );
}

export default AssassinToken;
