// src/components/tokens/djinn/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/djinn.png?url';

export type DjinnTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function DjinnToken(props: DjinnTokenProps) {
    return (
        <Token
            name='Djinn'
            image={iconSrc}
            {...props}
        />
    );
}

export default DjinnToken;
