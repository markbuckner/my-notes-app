"use client";

import Link from 'next/link'; // Import Link for client-side routing
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '../../components/Navbar';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  );

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else {
      router.push('/profile');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-normal bg-gray-100" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div id="spacer" className="p-8"></div>
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">Login</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
              />

            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
              >
                Login
              </button>
              {/* Password reset link */}
              <div className="text-center pl-0.5 mt-1.5 pt-4">
                <Link href="/auth/request-reset" className="text-blue-600 hover:text-blue-800 text-sm">
                  Reset my password 🔐
                </Link>
              </div>
            </div>
          </form>
          {message && <p className="text-red-500 text-center mt-2">{message}</p>}
        </div>
      </div>
    </>
  );
}

export default Login;
