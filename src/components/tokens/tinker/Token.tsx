// src/components/tokens/tinker/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/tinker.png?url';

export type TinkerTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function TinkerToken(props: TinkerTokenProps) {
    return (
        <Token
            name='Tinker'
            image={iconSrc}
            {...props}
        />
    );
}

export default TinkerToken;
