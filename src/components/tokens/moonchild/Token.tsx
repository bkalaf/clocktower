// src/components/tokens/moonchild/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/moonchild.png?url';

export type MoonchildTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function MoonchildToken(props: MoonchildTokenProps) {
    return <Token name='Moonchild' image={iconSrc} {...props} />;
}

export default MoonchildToken;

