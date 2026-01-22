// src/components/tokens/judge/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/judge.png?url';

export type JudgeTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function JudgeToken(props: JudgeTokenProps) {
    return (
        <Token
            name='Judge'
            image={iconSrc}
            {...props}
        />
    );
}

export default JudgeToken;
