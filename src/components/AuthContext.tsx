"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Session } from '@supabase/supabase-js';

// Define the shape of your context state
interface AuthContextType {
    isLoggedIn: boolean;
    isLoading: boolean;
    userName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Function to update auth state based on session data
        const updateAuthState = (session: Session | null) => {
            setIsLoggedIn(!!session);
            setIsLoading(false);
        };

        // Initial check for current auth state
        const checkLoginStatus = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            updateAuthState(sessionData.session);
            setUserName(sessionData.session?.user.email || '');
        };

        checkLoginStatus();

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            updateAuthState(session); // update session
            setUserName(session?.user.email || ''); // update username
        });

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, userName }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
