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
    onAuthStateChanged,
    User,
    signInWithCustomToken,
} from "firebase/auth";
import { auth } from '../firebase';
import Cookies from 'js-cookie';

interface AuthContextType {
    authError: string;
    isAuthLoading: boolean;
    user: User | null;
    logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authError, setAuthError] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!auth) {
            console.error('Firebase auth is not initialized');
            return;
        }
        const fetchUser = async () => {
            setIsAuthLoading(true);
            try {
                const token = Cookies.get('MNFBCT');
                if (token) {
                    const userCredential = await signInWithCustomToken(auth, token);
                    setUser(userCredential.user);
                }
            } catch (err) {
                console.error('Error fetching user:', err);
                setAuthError('Session expired or invalid.');
            } finally {
                setIsAuthLoading(false);
            }
        };
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setIsAuthLoading(true);
            setUser(currentUser || null);
            setIsAuthLoading(false);
        });
        fetchUser();
        return () => unsubscribe();
    }, []);

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

    const logOut = useCallback(async (): Promise<void> => {
        try {
            await auth.signOut();
            Cookies.remove('SNMNCT', { domain: '.machinename.dev', path: '/' });
            setUser(null);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }, [handleError]);

    const contextValue = useMemo(() => ({
        authError,
        isAuthLoading,
        user,
        logOut,
    }), [
        authError,
        isAuthLoading,
        user,
        logOut,
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