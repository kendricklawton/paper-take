import React, { ReactNode } from 'react';
import { AppProvider } from './AppProvider';
import { AuthProvider } from './AuthProvider';
import { Suspense } from 'react';


interface ProviderWrapperProps {
    children: ReactNode;
}

const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children }) => {
    return (
        <AuthProvider>
                <AppProvider>
                    <Suspense>
                        {children}
                    </Suspense>
                </AppProvider>
        </AuthProvider>
    );
};

export default ProviderWrapper;