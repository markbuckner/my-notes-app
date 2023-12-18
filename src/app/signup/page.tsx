"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '../../components/Navbar';
import withAuth from '../../components/WithAuth';
import ReCAPTCHA from "react-google-recaptcha";

const SignUp: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  );

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();

    // Call the server component for reCAPTCHA verification
    if (captchaToken) {
      const verificationResponse = await fetch('/api/verify-captcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: captchaToken }),
      });

      const verificationResult = await verificationResponse.json();
      if (!verificationResult.success) {
        setMessage("CAPTCHA verification failed. Please try again.");
        setCaptchaToken(null); // Reset captcha token on failure
        return;
      }
    } else {
      setMessage("Please complete the CAPTCHA.");
      return;
    }

    // If CAPTCHA is valid, proceed with sign up
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else {
      router.push('/login');
    }
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="flex flex-col items-center justify-normal min-h-screen bg-gray-100">
        <div id="spacer" className="p-8"></div>
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">Sign Up</h2>
          <form onSubmit={handleSignUp} className="space-y-6">
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
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} // Make sure to use the correct environment variable
              onChange={setCaptchaToken}
            />
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
              >
                Sign Up
              </button>
            </div>
          </form>
          {message && <p className="text-red-500 text-center mt-2">{message}</p>}
        </div>
      </div>
    </>
  );
}

export default withAuth(SignUp);
