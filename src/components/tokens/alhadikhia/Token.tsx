// src/components/tokens/alhadikhia/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/alhadikhia.png?url';

export type AlhadikhiaTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function AlhadikhiaToken(props: AlhadikhiaTokenProps) {
    return (
        <Token
            name='Al-Hadikhia'
            image={iconSrc}
            {...props}
        />
    );
}

export default AlhadikhiaToken;
