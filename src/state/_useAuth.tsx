// src/state/_useAuth.tsx
// import {
//     createContext,
//     useCallback,
//     useContext,
//     useEffect,
//     useMemo,
//     useState,
//     type Dispatch,
//     type ReactNode,
//     type SetStateAction
// } from 'react';
// import type { AuthedUser } from '../types/game';
// import { whoami, logout as logoutRequest } from '../lib/api';

// type AuthContextValue = {
//     user: AuthedUser | null;
//     loading: boolean;
//     refreshWhoami: () => Promise<void>;
//     logoutAndClear: () => Promise<void>;
//     setUser: Dispatch<SetStateAction<AuthedUser | null>>;
// };

// const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// function useProvideAuth(): AuthContextValue {
//     const [user, setUser] = useState<AuthedUser | null>(null);
//     const [loading, setLoading] = useState(true);

//     const refreshWhoami = useCallback(async () => {
//         setLoading(true);
//         try {
//             const response = await whoami();
//             setUser(response.user);
//         } catch (error) {
//             console.error(error);
//             setUser(null);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         void refreshWhoami();
//     }, [refreshWhoami]);

//     const logoutAndClear = useCallback(async () => {
//         setUser(null);
//         try {
//             await logoutRequest();
//         } catch (error) {
//             console.error(error);
//         } finally {
//             await refreshWhoami();
//         }
//     }, [refreshWhoami]);

//     return useMemo(
//         () => ({
//             user,
//             loading,
//             refreshWhoami,
//             logoutAndClear,
//             setUser
//         }),
//         [user, loading, refreshWhoami, logoutAndClear, setUser]
//     );
// }

// export function AuthProvider({ children }: { children: ReactNode }) {
//     const auth = useProvideAuth();
//     return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// }
