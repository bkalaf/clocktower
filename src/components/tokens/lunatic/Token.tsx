// src/components/tokens/lunatic/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/lunatic.png?url';

export type LunaticTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function LunaticToken(props: LunaticTokenProps) {
    return (
        <Token
            name='Lunatic'
            image={iconSrc}
            {...props}
        />
    );
}

export default LunaticToken;
