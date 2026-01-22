// src/components/tokens/acrobat/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/acrobat.png?url';

export type AcrobatTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function AcrobatToken(props: AcrobatTokenProps) {
    return (
        <Token
            name='Acrobat'
            image={iconSrc}
            {...props}
        />
    );
}

export default AcrobatToken;
