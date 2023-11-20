"use client";

import { useRouter } from 'next/navigation';
import { supabase } from '../supabaseClient';

const LogoutButton: React.FC = () => {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login'); // Redirect to login page after logout
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
