// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
);

interface AuthState {
    isLoggedIn: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isLoggedIn: false,
        isLoading: true,
    });

    useEffect(() => {
        const checkLoginStatus = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            setAuthState({
                isLoggedIn: !!sessionData.session,
                isLoading: false,
            });
        };

        checkLoginStatus();
    }, []);

    return (
        <AuthContext.Provider value={authState}>
            {children}
        </AuthContext.Provider>
    );
};
