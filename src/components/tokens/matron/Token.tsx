// src/components/tokens/matron/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/matron.png?url';

export type MatronTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function MatronToken(props: MatronTokenProps) {
    return (
        <Token
            name='Matron'
            image={iconSrc}
            {...props}
        />
    );
}

export default MatronToken;
