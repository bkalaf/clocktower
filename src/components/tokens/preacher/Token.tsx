// src/components/tokens/preacher/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/preacher.png?url';

export type PreacherTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function PreacherToken(props: PreacherTokenProps) {
    return (
        <Token
            name='Preacher'
            image={iconSrc}
            {...props}
        />
    );
}

export default PreacherToken;
