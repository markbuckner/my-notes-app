"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '../../components/Navbar';

export default function SignUp() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const router = useRouter();
    // Initialize the Supabase client for client-side usage
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
    );
    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setMessage(error.message);
        else {
            // Post-signup actions like redirecting to a welcome page or login page
            router.push('/login');
        }
    };

    return (
        <div>
            <Navbar />
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Sign Up</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
