// src/components/tokens/pithag/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/pithag.png?url';

export type PithagTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function PithagToken(props: PithagTokenProps) {
    return <Token name='Pit-Hag' image={iconSrc} {...props} />;
}

export default PithagToken;

