// src/components/tokens/barber/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/barber.png?url';

export type BarberTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function BarberToken(props: BarberTokenProps) {
    return (
        <Token
            name='Barber'
            image={iconSrc}
            {...props}
        />
    );
}

export default BarberToken;
