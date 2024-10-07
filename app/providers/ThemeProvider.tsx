'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';

interface ThemeContextType {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const contextValue = useMemo(() => ({ theme, setTheme}), [theme, setTheme]);

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeContext must be used within ThemeProvider.tsx');
    }
    return context;
};
