// src/components/tokens/voudon/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/voudon.png?url';

export type VoudonTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function VoudonToken(props: VoudonTokenProps) {
    return (
        <Token
            name='Voudon'
            image={iconSrc}
            {...props}
        />
    );
}

export default VoudonToken;
