"use client";

import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';


const LogoutButton: React.FC = () => {
    const router = useRouter();
    // Initialize the Supabase client for client-side usage
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
    );
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login'); // Redirect to login page after logout
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
