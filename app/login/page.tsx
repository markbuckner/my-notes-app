"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // Using the router compatible with App Router
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '../../components/Navbar';

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const router = useRouter();
    // Initialize the Supabase client for client-side usage
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
    );

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setMessage(error.message);
        else {
            // Redirect to a protected page or the home page after successful login
            router.push('/protected');
        }
    };

    return (
        
        <div>
            <Navbar /> 
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
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
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
