// src/components/tokens/nightwatchman/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/nightwatchman.png?url';

export type NightwatchmanTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function NightwatchmanToken(props: NightwatchmanTokenProps) {
    return <Token name='Nightwatchman' image={iconSrc} {...props} />;
}

export default NightwatchmanToken;

