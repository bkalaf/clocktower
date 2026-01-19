// src/components/tokens/farmer/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/farmer.png?url';

export type FarmerTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function FarmerToken(props: FarmerTokenProps) {
    return <Token name='Farmer' image={iconSrc} {...props} />;
}

export default FarmerToken;

