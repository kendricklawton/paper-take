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
    sendPasswordResetEmail,
    // sendEmailVerification,
    signInWithEmailAndPassword,
    updateProfile,
    verifyBeforeUpdateEmail, 
    EmailAuthProvider,
    updatePassword,
    User
} from "firebase/auth";
import { auth } from '../firebase';

interface AuthContextType {
    authError: string | null;
    isLoadingAuth: boolean;
    user: User | null;
    userDisplayName: string | null;
    userEmail: string | null;
    createUserAccount: (email: string, password: string) => Promise<boolean>;
    deleteUserAccount: (password: string) => Promise<boolean>;
    login: (email: string, password: string) => Promise<boolean>;
    logOut: () => Promise<boolean>;
    resetPassword: (email: string) => Promise<boolean>;
    setAuthError: (error: string | null) => void;
    updateUserDisplayName: (newDisplayName: string) => Promise<boolean>;
    updateUserPassword: (newPassword: string, oldPassword: string) => Promise<boolean>;
    updateUserEmail: (newEmail: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const baseURL = 'http://localhost:3000/';
    const [user, setUser] = useState<User | null>(null);
    const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isLoadingAuth, setIsAuthLoading] = useState<boolean>(true);
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            setUserDisplayName(user.displayName || null);
            setUserEmail(user.email || null);
        } else {
            setUserDisplayName(null);
            setUserEmail(null);
        }
    }, [user]);


    const clearAuthError = useCallback(() => {
        setAuthError(null);
    }, []);

    const handleAuthError = (error: unknown) => {
        if (error instanceof FirebaseError) {
            console.error('FirebaseError:', error);
            switch (error.code) {
                case 'auth/invalid-credential':
                    setAuthError('Invalid credentials');
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
                    setAuthError('Access to this account has been temporarily ' +
                        'disabled due to many failed login attempts. ' +
                        'You can immediately restore it by resetting your password or you can try again later. If you need immediate assistance, please contact support.');
                    break;
                default:
                    setAuthError('An unknown firebase error occurred');
            }
        } else {
            console.error('An error occurred:', error);
            setAuthError('An error occurred. Please try again later. If the problem persists, please contact support.');
        }
    };

    const authAction = useCallback(async (action: () => Promise<boolean>) => {
        clearAuthError();
        try {
            return await action();
        } catch (error) {
            handleAuthError(error);
            return false;
        }
    }, [clearAuthError]);

    const createUserAccount = useCallback((email: string, password: string) =>
        authAction(async () => {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            return true;
        }), [authAction]);


    const resetPassword = useCallback((email: string) =>   
        authAction(async () => {
            await sendPasswordResetEmail(auth, email, {
                url: baseURL,
                handleCodeInApp: true,
            });
            return true;
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
                setUser(null);
                return true;
            } else {
                setAuthError('User is null');
                throw new Error('User is null');
            }
        }), [authAction, user]);

    const login = useCallback((email: string, password: string) =>
        authAction(async () => {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            return true;
        }), [authAction]);

    const logOut = useCallback(() =>
        authAction(async () => {
            await auth.signOut();
            setUser(null);
            return true;
        }), [authAction]);

    const updateUserDisplayName = useCallback(async (newDisplayName: string) => {
        const prevUserDisplayName = userDisplayName;
        setUserDisplayName(newDisplayName);
        clearAuthError();
        if (user) {
            try {
                await updateProfile(user, { displayName: newDisplayName });
                return true;
            } catch (error) {
                setUserDisplayName(prevUserDisplayName);
                handleAuthError(error);
                return false;
            }
        } else {
            setUserDisplayName(prevUserDisplayName);
            setAuthError('User is null');
            console.error('User is null');
            return false;
        }
    }, [user, userDisplayName, clearAuthError]);

    const updateUserEmail = useCallback(async (newEmail: string, password: string) => {
        const prevUserEmail = userEmail;
        setUserEmail(newEmail);
        clearAuthError();
        if (user) {
            try {
                if (user.email) {
                    const credential = EmailAuthProvider.credential(user.email, password);
                    await reauthenticateWithCredential(user, credential);
                    await verifyBeforeUpdateEmail(user, newEmail, {
                        url: baseURL,
                        handleCodeInApp: true,
                    });
                    return true;
                } else {
                    setUserEmail(prevUserEmail);
                    setAuthError('User email is null');
                    console.error('User email is null');
                    return false;
                }
            } catch (error) {
                setUserEmail(prevUserEmail);
                handleAuthError(error);
                return false;
            }
        } else {
            setUserEmail(prevUserEmail);
            setAuthError('User is null');
            console.error('User is null');
            return false;
        }
    }, [user, userEmail, clearAuthError]);

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
                return true;
            } else {
                throw new Error('User is null');
            }
        }), [authAction, user]);

    const contextValue = useMemo(() => ({
        authError,
        isLoadingAuth,
        user,
        userDisplayName,
        userEmail,
        createUserAccount,
        deleteUserAccount,
        login,
        logOut,
        resetPassword,
        setAuthError,
        updateUserDisplayName,
        updateUserPassword,
        updateUserEmail,
    }), [
        authError,
        isLoadingAuth,
        user,
        userDisplayName,
        userEmail,
        createUserAccount,
        deleteUserAccount,
        login,
        logOut,
        resetPassword,
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

// export const MemoizedAuthProvider = memo(AuthProvider);
