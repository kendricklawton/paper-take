import React, { ReactNode } from 'react';
import { AppProvider } from './AppProvider';
import { ThemeProvider } from './ThemeProvider';

interface ProviderWrapperProps {
    children: ReactNode;
}

const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children }) => {
    return (
        <ThemeProvider>
            <AppProvider>
                {children}
            </AppProvider>
        </ThemeProvider>
    );
};

export default ProviderWrapper;