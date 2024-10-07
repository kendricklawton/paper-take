'use client'

import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    useEffect,
    ReactNode,
} from 'react';
import {
    createUserWithEmailAndPassword,
    deleteUser,
    onAuthStateChanged,
    reauthenticateWithCredential,
    sendEmailVerification,
    signInWithEmailAndPassword,
    updateProfile,
    verifyBeforeUpdateEmail, 
    EmailAuthProvider,
    updatePassword,
    User
} from "firebase/auth";
import { auth } from '../firebase';

interface AuthContextType {
    // authError: string | null;
    isLoadingAuth: boolean;
    user: User | null;
    createUserAccount: (email: string, password: string) => Promise<void>;
    deleteUserAccount: (password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logOut: () => Promise<void>;
    updateUserDisplayName: (newDisplayName: string) => Promise<void>;
    updateUserPassword: (newPassword: string, oldPassword: string) => Promise<void>;
    updateUserEmail: (newEmail: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoadingAuth, setIsAuthLoading] = useState<boolean>(true);
    // const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const authAction = useCallback(async (action: () => Promise<void>) => {
        // setAuthError(null);
        try {
            await action();
        } catch (error) {
            console.log(error);
        }
    }, []);

    const createUserAccount = useCallback((email: string, password: string) =>
        authAction(async () => {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredential.user, {
                url: 'http://nestanote.com/notes',
                handleCodeInApp: true,
            });
            setUser(userCredential.user);
        }), [authAction]);

    const deleteUserAccount = useCallback((password: string) =>
        authAction(async () => {
            if (user) {
                if (user.email) {
                    const credential = EmailAuthProvider.credential(user.email, password);
                    await reauthenticateWithCredential(user, credential);
                } else {
                    throw new Error('User email is null');
                }
                await deleteUser(user);
            } else {
                throw new Error('User is null');
            }
        }), [authAction, user]);

    const login = useCallback((email: string, password: string) =>
        authAction(async () => {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
        }), [authAction]);

    const logOut = useCallback(async () => {
        await auth.signOut();
        setUser(null);
    }, []);

    const updateUserDisplayName = useCallback((newDisplayName: string) =>
        authAction(async () => {
            if (user) {
                await updateProfile(user, { displayName: newDisplayName });
            }
        }), [authAction, user]);

    const updateUserEmail = useCallback((newEmail: string, password: string) =>
        authAction(async () => {
            if (user) {
                if (user.email) {
                    const credential = EmailAuthProvider.credential(user.email, password);
                    await reauthenticateWithCredential(user, credential);
                } else {
                    throw new Error('User email is null');
                }
                await verifyBeforeUpdateEmail(user, newEmail, {
                    url: 'http://localhost:3000/notes',
                    handleCodeInApp: true,
                });
            } else {
                throw new Error('User is null');
            }
        }), [authAction, user]);


    const updateUserPassword = useCallback((newPassword: string, password: string) =>
        authAction(async () => {
            if (user) {
                if (user.email) {
                    const credential = EmailAuthProvider.credential(user.email, password);
                    await reauthenticateWithCredential(user, credential);
                } else {
                    throw new Error('User email is null');
                }
                await updatePassword(user, newPassword);
            } else {
                throw new Error('User is null');
            }
        }), [authAction, user]);

    const contextValue = useMemo(() => ({
        // authError,
        isLoadingAuth,
        user,
        createUserAccount,
        deleteUserAccount,
        login,
        logOut,
        updateUserDisplayName,
        updateUserPassword,
        updateUserEmail,
    }), [
        // authError,
        isLoadingAuth,
        user,
        createUserAccount,
        deleteUserAccount,
        login,
        logOut,
        updateUserDisplayName,
        updateUserPassword,
        updateUserEmail,
    ]);


    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
};

// export const MemoizedAuthProvider = memo(AuthProvider);
