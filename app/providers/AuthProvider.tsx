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
                const token = Cookies.get('SNMNCT');
                if (token && !user) {
                    const userCredential = await signInWithCustomToken(auth, token);
                    setUser(userCredential.user);
                } else if (!token && user) {
                    await auth.signOut();
                    setUser(null);
                }
            } catch (err) {
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
    }, [user]);

    const logOut = useCallback(async (): Promise<void> => {
        try {
            await auth.signOut();
            Cookies.remove('SNMNCT', { domain: '.machinename.dev', path: '/' });
            setUser(null);
        } catch (error) {
            setAuthError('' + error);
            throw error;
        }
    }, []);

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