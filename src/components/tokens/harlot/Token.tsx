// src/components/tokens/harlot/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/harlot.png?url';

export type HarlotTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function HarlotToken(props: HarlotTokenProps) {
    return (
        <Token
            name='Harlot'
            image={iconSrc}
            {...props}
        />
    );
}

export default HarlotToken;
