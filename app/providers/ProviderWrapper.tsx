import React, { ReactNode } from 'react';
import { AppProvider } from './AppProvider';
import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from './ThemeProvider';

interface ProviderWrapperProps {
    children: ReactNode;
}

const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children }) => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <AppProvider>
                    {children}
                </AppProvider>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default ProviderWrapper;