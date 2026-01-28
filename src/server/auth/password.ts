// src/server/auth/password.ts
import bcrypt from 'bcryptjs';
import argon2 from 'argon2';

const ARGON2_OPTIONS = {
    type: argon2.argon2id,
    memoryCost: 65_536,
    timeCost: 3,
    parallelism: 1
} as const;

const BCRYPT_PREFIXES = ['$2a$', '$2b$', '$2y$'];

export type VerifyPasswordOptions = {
    /**
     * Optional hook that persists a replacement argon2 hash after a successful
     * bcrypt verification. Called only when the stored hash is detected as bcrypt.
     */
    onUpgrade?: (newHash: string) => Promise<void>;
};

export async function hashPassword(password: string) {
    return argon2.hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(
    password: string,
    passwordHash: string,
    options?: VerifyPasswordOptions
) {
    const { onUpgrade } = options ?? {};

    if (passwordHash.startsWith('$argon2')) {
        try {
            return await argon2.verify(passwordHash, password);
        } catch {
            return false;
        }
    }

    const isBcrypt = BCRYPT_PREFIXES.some((prefix) => passwordHash.startsWith(prefix));
    if (isBcrypt) {
        const matches = await bcrypt.compare(password, passwordHash);
        if (!matches) {
            return false;
        }

        if (onUpgrade) {
            try {
                const newHash = await hashPassword(password);
                await onUpgrade(newHash);
            } catch (error) {
                console.error('Failed to upgrade bcrypt hash to argon2', error);
            }
        }
        return true;
    }

    return false;
}
