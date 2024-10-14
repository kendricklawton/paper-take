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
import { FirebaseError } from 'firebase/app';
import {
    createUserWithEmailAndPassword,
    deleteUser,
    onAuthStateChanged,
    reauthenticateWithCredential,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    updateProfile,
    // updatePassword,
    verifyBeforeUpdateEmail,
    EmailAuthProvider,
    User,
} from "firebase/auth";
import { auth } from '../firebase';

interface AuthContextType {
    authError: string;
    isLoadingAuth: boolean;
    user: User | null;
    userDisplayName: string | null;
    userEmail: string | null;
    clearAuthError: () => void;
    createUserAccount: (email: string, password: string) => Promise<void>;
    deleteUserAccount: (password: string) => Promise<void>;
    logIn: (email: string, password: string) => Promise<void>;
    logOut: () => Promise<void>;
    sendPasswordReset: (email: string) => Promise<void>;
    sendUserVerification: () => Promise<void>;
    updateUserDisplayName: (newDisplayName: string) => Promise<void>;
    updateUserEmail: (newEmail: string, password: string) => Promise<void>;
    // updateUserPassword: (newPassword: string, oldPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // const baseURL = 'http://papertake.io';
    const [authError, setAuthError] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [userDisplayName, setUserDisplayName] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [isLoadingAuth, setIsAuthLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!auth) {
            console.error('Auth is not defined');
            setIsAuthLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            setUserDisplayName(user.displayName || '');
            setUserEmail(user.email || '');
        } else {
            setUserDisplayName('');
            setUserEmail('');
        }
    }, [user]);

    const handleAuthError = useCallback((error: unknown) => {
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case 'auth/invalid-credential':
                    setAuthError('Invalid credentials provided');
                    break;
                case 'auth/email-already-in-use':
                    setAuthError('Email already in use');
                    break;
                case 'auth/invalid-email':
                    setAuthError('Invalid email address');
                    break;
                case 'auth/operation-not-allowed':
                    setAuthError('Operation not allowed');
                    break;
                case 'auth/weak-password':
                    setAuthError('The password is too weak');
                    break;
                case 'auth/too-many-requests':
                    setAuthError('Access temporarily disabled due to many failed attempts');
                    break;
                default:
                    setAuthError('An unknown error occurred.');
            }
        } else {
            setAuthError('An error occurred. Please try again later.');
        }
    }, []);

    const clearAuthError = useCallback(() => {
        setAuthError('');
    }, []);

    const createUserAccount = useCallback(async (email: string, password: string): Promise<void> => {
        clearAuthError();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(
                userCredential.user,
                // {
                //     url: baseURL,
                //     handleCodeInApp: true
                // }
            );
            setUser(userCredential.user);
        } catch (error) {
            handleAuthError(error);
            throw error;
        }
    }, [clearAuthError, handleAuthError]);

    const deleteUserAccount = useCallback(async (password: string): Promise<void> => {
        clearAuthError();
        try {
            if (user) {
                if (user.email) {
                    const credential = EmailAuthProvider.credential(user.email, password);
                    await reauthenticateWithCredential(user, credential);
                }
                await deleteUser(user);
                setUser(null);
            }
        } catch (error) {
            handleAuthError(error);
            throw error;
        }
    }, [clearAuthError, handleAuthError, user]);

    const logIn = useCallback(async (email: string, password: string): Promise<void> => {
        clearAuthError();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
        } catch (error) {
            handleAuthError(error);
            throw error;
        }
    }, [clearAuthError, handleAuthError]);

    const logOut = useCallback(async (): Promise<void> => {
        clearAuthError();
        try {
            await auth.signOut();
            setUser(null);
        } catch (error) {
            handleAuthError(error);
            throw error;
        }
    }, [clearAuthError, handleAuthError]);

    const sendPasswordReset = useCallback(async (email: string): Promise<void> => {
        clearAuthError();
        try {
            await sendPasswordResetEmail(auth, email, 
            //     {
            //     url: baseURL,
            //     handleCodeInApp: true,
            // }
        );
        } catch (error) {
            handleAuthError(error);
            throw error;
        }
    }, [clearAuthError, handleAuthError]);

    const sendUserVerification = useCallback(async (): Promise<void> => {
        clearAuthError();
        try {
            if (user) {
                await sendEmailVerification(user,
                //      {
                //     url: baseURL,
                //     handleCodeInApp: true,
                // }
            );
            } else {
                throw new Error('User not found.');
            }
        } catch (error) {
            handleAuthError(error);
            throw error;
        }
    }, [clearAuthError, handleAuthError, user]);

    const updateUserDisplayName = useCallback(async (newDisplayName: string): Promise<void> => {
        clearAuthError();
        try {
            if (user) {
                await updateProfile(user, { displayName: newDisplayName });
                setUserDisplayName(newDisplayName);
            } else {
                throw new Error('User not found.');
            }
        } catch (error) {
            handleAuthError(error);
            throw error;
        }
    }, [clearAuthError, handleAuthError, user]);

    const updateUserEmail = useCallback(async (newEmail: string, password: string): Promise<void> => {
        clearAuthError();
        try {
            if (user) {
                const credential = EmailAuthProvider.credential(user.email!, password);
                await reauthenticateWithCredential(user, credential);
                await verifyBeforeUpdateEmail(user, newEmail,
                //      {
                //     url: baseURL,
                //     handleCodeInApp: true,
                // }
            );
            } else {
                throw new Error('User not found.');
            }
        } catch (error) {
            handleAuthError(error);
            throw error;
        }
    }, [clearAuthError, handleAuthError, user]);

    // const updateUserPassword = useCallback(async (newPassword: string, password: string): Promise<void> => {
    //     clearAuthError();
    //     try {
    //         if (user) {
    //             const credential = EmailAuthProvider.credential(user.email!, password);
    //             await reauthenticateWithCredential(user, credential);
    //             await updatePassword(user, newPassword);
    //         } else {
    //             throw new Error('User not found.');
    //         }
    //     } catch (error) {
    //         handleAuthError(error);
    //         throw error;
    //     }
    // }, [clearAuthError, handleAuthError, user]);

    const contextValue = useMemo(() => ({
        authError,
        isLoadingAuth,
        user,
        userDisplayName,
        userEmail,
        clearAuthError,
        createUserAccount,
        deleteUserAccount,
        logIn,
        logOut,
        sendPasswordReset,
        sendUserVerification,
        updateUserDisplayName,
        updateUserEmail,
        // updateUserPassword,
    }), [
        authError,
        isLoadingAuth,
        user,
        userDisplayName,
        userEmail,
        clearAuthError,
        createUserAccount,
        deleteUserAccount,
        logIn,
        logOut,
        sendPasswordReset,
        sendUserVerification,
        updateUserDisplayName,
        updateUserEmail,
        // updateUserPassword,
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