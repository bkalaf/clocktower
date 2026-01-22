// src/components/tokens/pacifist/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/pacifist.png?url';

export type PacifistTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function PacifistToken(props: PacifistTokenProps) {
    return (
        <Token
            name='Pacifist'
            image={iconSrc}
            {...props}
        />
    );
}

export default PacifistToken;
