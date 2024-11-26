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
    deleteUser,
    onAuthStateChanged,
    reauthenticateWithCredential,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile,
    verifyBeforeUpdateEmail,
    EmailAuthProvider,
    User,
    signInWithCustomToken,
} from "firebase/auth";
import { auth } from '../firebase';
import cookie from 'js-cookie';

interface AuthContextType {
    authError: string;
    isAuthLoading: boolean;
    user: User | null;
    clearAuthError: () => void;
    deleteUserAccount: (password: string) => Promise<void>;
    logOut: () => Promise<void>;
    sendPasswordReset: (email: string) => Promise<void>;
    sendUserVerification: () => Promise<void>;
    updateUserDisplayName: (newDisplayName: string) => Promise<void>;
    updateUserEmail: (newEmail: string, password: string) => Promise<void>;
}

const getCookie = (name: string): string | null => {
    return cookie.get(name) || null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authError, setAuthError] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

    useEffect(() => {
        const token = getCookie('auth_token');
        if (token) {
            console.log("Signing in with custom token");
            signInWithCustomToken(auth, token)
                .then((userCredential) => {
                    const user = userCredential.user;
                    setUser(user);
                })
                .catch((error) => {
                    console.error("Error signing in with custom token", error);
                    setUser(null);
                })
                .finally(() => setIsAuthLoading(false));
        } else {
            console.log("No token found");
            setUser(null);
            setIsAuthLoading(false);
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
            setIsAuthLoading(false);
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

    const logOut = useCallback(async (): Promise<void> => {
        clearAuthError();
        if (auth === null) {
            return;
        }
        try {
            document.cookie = "firebaseToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            await auth.signOut();
            setUser(null);
        } catch (error) {
            handleAuthError(error);
            throw error;
        }
    }, [clearAuthError, handleAuthError]);

    const sendPasswordReset = useCallback(async (email: string): Promise<void> => {
        clearAuthError();
        if (auth === null) {
            return;
        }
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
        clearAuthError,
        deleteUserAccount,
        logOut,
        sendPasswordReset,
        sendUserVerification,
        updateUserDisplayName,
        updateUserEmail,
    }), [
        authError,
        isAuthLoading,
        user,
        clearAuthError,
        deleteUserAccount,
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

