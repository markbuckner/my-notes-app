"use client";
import React, { useState, FormEvent } from 'react';
import Link from 'next/link'; // Import Link for client-side routing
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '../../../components/Navbar';

const RequestReset: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  // Initialize the browser client for Supabase
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  );

  const handleResetRequest = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Use the browser client's auth method directly
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-confirmation`,
      });

      if (error) {
        throw new Error(error.message);
      }

      setMessage('Check your email for the reset link.');
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during sign up.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-normal bg-gray-100" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div id="spacer" className="p-8"></div>
        <div className="max-w-lg w-full space-y-6 p-10 bg-white rounded-xl shadow-lg z-10">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Reset Your Password
            </h2>
            <p className="pt-4 text-sm text-gray-600">
              Enter your email to receive a password reset link.
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleResetRequest}>
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
            >
              Send Reset Link
            </button>
            {/* Go Back to Login Link */}
            <div className="text-center mt-4">
              <Link href="/login" className="text-blue-600 hover:text-blue-800 text-sm">
                Go Back to Login ⬅️
              </Link>
            </div>
          </form>
          {message && <p className="text-center mt-2">{message}</p>}
        </div>
      </div>
    </>
  );
};

export default RequestReset;
