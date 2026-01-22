// src/components/tokens/oracle/Token.tsx

import { Token, type TokenProps } from '@/components/grimoire/Token';
import iconSrc from '@/assets/icons/oracle.png?url';

export type OracleTokenProps = Omit<TokenProps, 'name' | 'image'>;

export function OracleToken(props: OracleTokenProps) {
    return (
        <Token
            name='Oracle'
            image={iconSrc}
            {...props}
        />
    );
}

export default OracleToken;
