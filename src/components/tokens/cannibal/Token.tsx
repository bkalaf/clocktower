// src/components/tokens/cannibal/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/cannibal.png?url';

export type CannibalTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function CannibalToken(props: CannibalTokenProps) {
    return <Token name='Cannibal' image={iconSrc} {...props} />;
}

export default CannibalToken;

