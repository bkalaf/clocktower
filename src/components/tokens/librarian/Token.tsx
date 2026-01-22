// src/components/tokens/librarian/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/librarian.png?url';

export type LibrarianTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function LibrarianToken(props: LibrarianTokenProps) {
    return (
        <Token
            name='Librarian'
            image={iconSrc}
            {...props}
        />
    );
}

export default LibrarianToken;
