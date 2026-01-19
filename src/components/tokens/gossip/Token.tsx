// src/components/tokens/gossip/Token.tsx
import * as React from 'react';
import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/gossip.png?url';

export type GossipTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function GossipToken(props: GossipTokenProps) {
    return <Token name='Gossip' image={iconSrc} {...props} />;
}

export default GossipToken;

