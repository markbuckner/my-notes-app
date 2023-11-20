"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';

export default function Protected() {
    const [username, setUsername] = useState('');
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

    if (!username) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Protected Page</h2>
            <p>Your username is {username}</p>
        </div>
    );
}
