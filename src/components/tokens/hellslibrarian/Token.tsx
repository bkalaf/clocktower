// src/components/tokens/hellslibrarian/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/hellslibrarian.png?url';

export type HellslibrarianTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function HellslibrarianToken(props: HellslibrarianTokenProps) {
    return (
        <Token
            name="Hell's Librarian"
            image={iconSrc}
            {...props}
        />
    );
}

export default HellslibrarianToken;
