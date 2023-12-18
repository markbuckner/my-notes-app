// app/signup-confirm/page.tsx
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

const SignupConfirm: React.FC = () => {
    const router = useRouter();

    return (
        <>
            <Navbar isLoggedIn={false} />
            <div className="flex flex-col items-center justify-normal min-h-screen bg-gray-100">
                <div id="spacer" className="p-8"></div>
                <div className="bg-white p-8 border rounded-lg shadow-lg max-w-xl mx-auto text-center">
                    <h1 className="text-3xl font-bold">Signup Successful 🎉</h1>

                    <p className="mt-2 text-justify max-w-prose mx-auto">
                        <b>Check your email for a confirmation link.</b> You must confirm your email
                        before logging in for the first time.
                    </p>
                    <button
                        onClick={() => router.push('/login')}
                        className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                    >
                        Proceed to Login
                    </button>
                </div>
            </div>
        </>
    );
};

export default SignupConfirm;
