// src/components/tokens/innkeeper/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/innkeeper.png?url';

export type InnkeeperTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function InnkeeperToken(props: InnkeeperTokenProps) {
    return (
        <Token
            name='Innkeeper'
            image={iconSrc}
            {...props}
        />
    );
}

export default InnkeeperToken;
