// src/components/tokens/puzzlemaster/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/puzzlemaster.png?url';

export type PuzzlemasterTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function PuzzlemasterToken(props: PuzzlemasterTokenProps) {
    return <Token name='Puzzlemaster' image={iconSrc} {...props} />;
}

export default PuzzlemasterToken;

