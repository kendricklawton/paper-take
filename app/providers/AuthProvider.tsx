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
    verifyBeforeUpdateEmail,
    EmailAuthProvider,
    User,
} from "firebase/auth";
import { auth } from '../firebase';

interface AuthContextType {
    authError: string;
    isAuthLoading: boolean;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authError, setAuthError] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [userDisplayName, setUserDisplayName] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsAuthLoading(true);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                const email = user.email || '';
                const displayName = user.displayName || '';
                setUserDisplayName(displayName);
                setUserEmail(email);
            } else {
                setUserDisplayName('');
                setUserEmail('');
            }
            setIsAuthLoading(false)
        });
        return () => unsubscribe();
    }, []);

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
            await sendEmailVerification(userCredential.user);
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
                const credential = EmailAuthProvider.credential(user.email!, password);
                await reauthenticateWithCredential(user, credential);
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
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            handleAuthError(error);
            throw error;
        }
    }, [clearAuthError, handleAuthError]);

    const sendUserVerification = useCallback(async (): Promise<void> => {
        clearAuthError();
        try {
            if (user) {
                await sendEmailVerification(user);
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
                await verifyBeforeUpdateEmail(user, newEmail);
            } else {
                throw new Error('User not found.');
            }
        } catch (error) {
            handleAuthError(error);
            throw error;
        }
    }, [clearAuthError, handleAuthError, user]);

    const contextValue = useMemo(() => ({
        authError,

        isAuthLoading,
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
    }), [
        authError,

        isAuthLoading,
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

