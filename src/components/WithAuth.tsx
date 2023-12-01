import React, { useState, useEffect, ComponentType } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
);

const withAuth = (WrappedComponent: React.FC<{ isLoggedIn: boolean }>) => {
    return function WithAuth() {
        const [isLoggedIn, setIsLoggedIn] = useState(false);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            const checkLoginStatus = async () => {
                const { data: sessionData } = await supabase.auth.getSession();
                setIsLoggedIn(!!sessionData.session);
                setIsLoading(false); // Set loading to false once we have the result
            };

            checkLoginStatus();
        }, []);

        if (isLoading) {
            return null; // Don't render anything until authentication state is known
        }

        return <WrappedComponent isLoggedIn={isLoggedIn} />;
    };
};

export default withAuth;
