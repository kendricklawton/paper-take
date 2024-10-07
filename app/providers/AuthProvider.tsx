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
import { FirebaseError } from 'firebase/app';

interface AuthContextType {
    authError: string;
    isLoadingAuth: boolean;
    user: User | null;
    createUserAccount: (email: string, password: string) => Promise<void>;
    deleteUserAccount: (password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logOut: () => Promise<void>;
    sendUserVerification: () => Promise<void>;
    setAuthError: (error: string) => void;
    updateUserDisplayName: (newDisplayName: string) => Promise<void>;
    updateUserPassword: (newPassword: string, oldPassword: string) => Promise<void>;
    updateUserEmail: (newEmail: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const paperTakeUrl = "http://localhost:3000/";
    const [authError, setAuthError] = useState<string>('');
    const [isLoadingAuth, setIsAuthLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleAuthError = useCallback((authError: unknown) => {
        if (authError instanceof FirebaseError) {
            console.log(authError.code);
            if (authError.code === 'auth/invalid-credential') {
                setAuthError('Invalid credentials provided. Please check your email and password.');
            } else {
                setAuthError('An authentication error occurred. Please try again.');
            }
        } else {
            console.log(authError);
            setAuthError('An unknown error occurred. Please try again.');
        }
    }, []);

    const authAction = useCallback(async (action: () => Promise<void>) => {
        setAuthError('');
        try {
            await action();
        } catch (authError) {
            handleAuthError(authError);
            console.log(authError);
        }
    }, [handleAuthError]);

    const createUserAccount = useCallback((email: string, password: string) =>
        authAction(async () => {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredential.user, {
                url: paperTakeUrl,
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

    const sendUserVerification = useCallback(() =>
        authAction(async () => {
            if (user) {
                await sendEmailVerification(user, {
                    url: paperTakeUrl,
                    handleCodeInApp: true,
                });
                console.log('Verification email sent');
            } else {
                throw new Error('User is null');
            }
        }), [authAction, user]);

    const updateUserDisplayName = useCallback((newDisplayName: string) =>
        authAction(async () => {
            if (user) {
                await updateProfile(user, { displayName: newDisplayName });
            } else {
                throw new Error('User is null');
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
                    url: paperTakeUrl,
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
        authError,
        isLoadingAuth,
        user,
        createUserAccount,
        deleteUserAccount,
        login,
        logOut,
        sendUserVerification,
        setAuthError,
        updateUserDisplayName,
        updateUserPassword,
        updateUserEmail,
    }), [
        authError,
        isLoadingAuth,
        user,
        createUserAccount,
        deleteUserAccount,
        login,
        logOut,
        sendUserVerification,
        setAuthError,
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
