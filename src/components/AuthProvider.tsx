// src/components/AuthProvider.tsx
import React from 'react';

// src/components/AuthProvider.tsx
export type AuthIdContext = {
    userId?: string;
    username?: string;
    roomId?: string;
    gameId?: string;
    isLoading: boolean;
};

export type AuthContext = AuthIdContext & {
    updateUser: () => void;
};

const AuthContext = React.createContext<AuthContext>({
    updateUser: () => {},
    isLoading: false
});

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//     const [init, setInit] = React.useState(false);
//     const [userId, setUserId] = React.useState<string | undefined>();
//     const [username, setUsername] = React.useState<string | undefined>();
//     const [isLoading, setIsLoading] = React.useState<boolean>(false);
//     const updateUser = useCallback(() => {
//         const func = async () => {
//             const { user } = await whoamiFn();
//             setUserId(user?._id);
//             setUsername(user?.name);
//         };
//         setIsLoading(true);
//         func()
//             .then(() => setIsLoading(false))
//             .then(() => setInit(true));
//     }, []);
//     React.useEffect(() => {
//         if (!init) {
//             updateUser();
//         }
//     }, [init, updateUser]);
//     const value = useMemo(
//         (): AuthContext => ({
//             userId,
//             username,
//             isLoading,
//             updateUser
//         }),
//         [isLoading, updateUser, userId, username]
//     );
//     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }
