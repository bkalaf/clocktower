// src/components/tokens/artist/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/artist.png?url';

export type ArtistTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function ArtistToken(props: ArtistTokenProps) {
    return <Token name='Artist' image={iconSrc} {...props} />;
}

export default ArtistToken;

