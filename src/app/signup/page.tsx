"use client";
import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '../../components/Navbar';
import withAuth from '../../components/WithAuth';
import ReCAPTCHA from 'react-google-recaptcha';

const SignUp: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const onRecaptchaExpired = () => {
    // Reset CAPTCHA state when it expires
    setCaptchaToken(null);
    setIsCaptchaVerified(false);
  };

  useEffect(() => {
    // Clear any previous messages when the user starts typing again
    setMessage('');
    // Do not reset isCaptchaVerified here to persist its state across attempts
  }, [email, password]);

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();

    // Check for missing email or password
    if (!email || !password) {
      setMessage('Please fill in all fields.');
      return;
    }

    if (password.length < 6) { // Assuming 6 is the minimum password length
      setMessage('Password is too short.');
      return;
    }

    if (!isCaptchaVerified) {
      if (!captchaToken) {
        setMessage('Please complete the CAPTCHA.');
        return;
      }

      try {
        const verificationResponse = await fetch('/api/verify-captcha', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: captchaToken }),
        });

        const verificationResult = await verificationResponse.json();
        if (!verificationResult.success) {
          setMessage('CAPTCHA verification failed. Please try again.');
          setCaptchaToken(null); // Reset captcha token on failure
          return;
        }

        setIsCaptchaVerified(true);
      } catch (error: any) {
        setMessage('An error occurred during CAPTCHA verification. Please try again.');
        return;
      }
    }

    // If CAPTCHA is verified, proceed with sign up
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(error.message);
        // Only reset CAPTCHA if the error is not 429 (Too Many Requests)?
        if (error.status !== 429) { // 429: Too Many Requests
          setIsCaptchaVerified(false);
          setCaptchaToken(null);
        }
      } else {
        router.push('/login');
      }
    } catch (error: any) {
      setMessage('An error occurred during sign up. Please try again.');
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
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
              onChange={(token) => {
                setCaptchaToken(token);
                if (token) {
                  setIsCaptchaVerified(true);
                }
              }}
              onExpired={onRecaptchaExpired} // Reset CAPTCHA state when expired
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
};

export default withAuth(SignUp);
