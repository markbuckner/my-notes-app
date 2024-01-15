"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '../../../components/Navbar';

const ResetConfirmation: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
    );

    const updatePassword = async () => {
        const { data, error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            setMessage('Failed to update password: ' + error.message);
        } else {
            // Logout the user after updating the password
            await supabase.auth.signOut();
            setMessage('Password updated successfully. Please login with your new password.');
            // Redirect to login after a delay
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-normal bg-gray-100" style={{ minHeight: 'calc(100vh - 64px)' }}>
                <div id="spacer" className="p-8"></div>
                <div className="max-w-lg w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">
                            Reset Your Password
                        </h2>
                        <p className="py-2 text-sm text-gray-600">
                            Enter your new password below.
                        </p>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password"
                            className="mt-2 p-3 border rounded w-full"
                            required
                        />
                        <button
                            onClick={updatePassword}
                            className="mt-4 w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                        >
                            Update Password
                        </button>
                        {message && <p className="text-center mt-2">{message}</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetConfirmation;
