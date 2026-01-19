// src/components/tokens/bonecollector/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/bonecollector.png?url';

export type BonecollectorTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function BonecollectorToken(props: BonecollectorTokenProps) {
    return <Token name='Bone Collector' image={iconSrc} {...props} />;
}

export default BonecollectorToken;

