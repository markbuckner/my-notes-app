// Add this at the top of your file
"use client";

import { useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            setMessage(error.message);
        } else if (data && data.user) {
            setMessage(`Check your email for the confirmation link: ${data.user.email}`);
        } else {
            setMessage('Signup successful, but no user data returned');
        }
    };    

    return (
        <div>
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
