// src/components/tokens/apprentice/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/apprentice.png?url';

export type ApprenticeTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function ApprenticeToken(props: ApprenticeTokenProps) {
    return (
        <Token
            name='Apprentice'
            image={iconSrc}
            {...props}
        />
    );
}

export default ApprenticeToken;
