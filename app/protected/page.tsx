"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';
import LogoutButton from '../../components/LogoutButton'; // Import the LogoutButton component

const Protected: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const { data: sessionData, error } = await supabase.auth.getSession();

            if (error || !sessionData.session || !sessionData.session.user) {
                router.push('/login');
                return;
            }

            setUsername(sessionData.session.user.email || 'No email found');
        };

        checkSession();
    }, [router]);

    return (
        <div>
            <h2>Protected Page</h2>
            {username ? (
                <>
                    <p>Your username is {username}</p>
                    <LogoutButton /> {/* Add the LogoutButton here */}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Protected;
