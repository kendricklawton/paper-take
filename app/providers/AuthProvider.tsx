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
    EmailAuthProvider,
    createUserWithEmailAndPassword,
    deleteUser,
    GoogleAuthProvider,
    onAuthStateChanged,
    reauthenticateWithCredential,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
    User,
    verifyBeforeUpdateEmail,
} from "firebase/auth";
import { auth } from '../firebase';

interface AuthContextType {
    authError: string;
    isAuthLoading: boolean;
    user: User | null;
    createUserAccount: (email: string, password: string) => Promise<void>;
    deleteUserAccount: (password: string) => Promise<void>;
    logIn: (email: string, password: string) => Promise<void>;
    logInWithGoogle: () => Promise<void>;
    logOut: () => Promise<void>;
    sendPasswordReset: (email: string) => Promise<void>;
    sendUserVerification: () => Promise<void>;
    updateUserDisplayName: (newDisplayName: string) => Promise<void>;
    updateUserEmail: (newEmail: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authError, setAuthError] = useState<string>('');
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const handleError = useCallback((error: unknown) => {
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
                    setAuthError('Unknown FirebaseError, error.code: ' + error.code);
            }
        } else {
            setAuthError('' + error);
        }
    }, []);

    useEffect(() => {
        if (!auth) {
            console.error('Firebase auth is not initialized');
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setIsAuthLoading(true);
            setUser(currentUser || null);
            setIsAuthLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    const createUserAccount = useCallback(async (email: string, password: string): Promise<void> => {
        setIsAuthLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredential.user);
        } catch (error) {
            handleError(error);
        } finally {
            setIsAuthLoading(false);
        }
    }, [handleError]);

    const deleteUserAccount = useCallback(async (password: string): Promise<void> => {
        try {
            if (user) {
                const credential = EmailAuthProvider.credential(user.email!, password);
                await reauthenticateWithCredential(user, credential);
                await deleteUser(user);
                setUser(null);
            }
        } catch (error) {
            setAuthError('' + error);
            throw error;
        }
    }, [user]);

    const logIn = useCallback(async (email: string, password: string): Promise<void> => {
        setIsAuthLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
        } catch (error) {
            handleError(error);
        } finally {
            setIsAuthLoading(false);
        }
    }, [handleError]);

    const logInWithGoogle = useCallback(async (): Promise<void> => {
        try {
            setIsAuthLoading(true);
            const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
            setUser(userCredential.user);
        } catch (error) {
            handleError(error);
        } finally {
            setIsAuthLoading(false);
        }
    }, [handleError]);

    const logOut = useCallback(async (): Promise<void> => {
        try {
            await auth.signOut();
            setUser(null);
        } catch (error) {
            setAuthError('' + error);
            throw error;
        }
    }, []);

    const sendPasswordReset = useCallback(async (email: string): Promise<void> => {
        if (auth === null) {
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }, [handleError]);

    const sendUserVerification = useCallback(async (): Promise<void> => {
        try {
            if (user) {
                await sendEmailVerification(user);
            } else {
                throw new Error('User not found.');
            }
        } catch (error) {
            setAuthError('' + error);
            throw error;
        }
    }, [user]);

    const updateUserDisplayName = useCallback(async (newDisplayName: string): Promise<void> => {
        try {
            if (user) {
                await updateProfile(user, { displayName: newDisplayName });
            } else {
                throw new Error('User not found.');
            }
        } catch (error) {
            setAuthError('' + error);
            throw error;
        }
    }, [user]);

    const updateUserEmail = useCallback(async (newEmail: string, password: string): Promise<void> => {
        try {
            if (user) {
                const credential = EmailAuthProvider.credential(user.email!, password);
                await reauthenticateWithCredential(user, credential);
                await verifyBeforeUpdateEmail(user, newEmail);
            } else {
                throw new Error('User not found.');
            }
        } catch (error) {
            setAuthError('' + error);
            throw error;
        }
    }, [user]);


    const contextValue = useMemo(() => ({
        authError,
        isAuthLoading,
        user,
        createUserAccount,
        deleteUserAccount,
        logIn,
        logInWithGoogle,
        logOut,
        sendPasswordReset,
        sendUserVerification,
        updateUserDisplayName,
        updateUserEmail,
    }), [
        authError,
        isAuthLoading,
        user,
        createUserAccount,
        deleteUserAccount,
        logIn,
        logInWithGoogle,
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