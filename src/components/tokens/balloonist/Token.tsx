// src/components/tokens/balloonist/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/balloonist.png?url';

export type BalloonistTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function BalloonistToken(props: BalloonistTokenProps) {
    return (
        <Token
            name='Balloonist'
            image={iconSrc}
            {...props}
        />
    );
}

export default BalloonistToken;
