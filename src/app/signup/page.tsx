"use client";
import React, { useState, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import ReCAPTCHA from 'react-google-recaptcha';
import Spinner from '../../components/Spinner';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const router = useRouter();

  const onRecaptchaExpired = () => {
    setCaptchaToken(null);
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setMessage('Signing up...');

    if (!email || !password) {
      setMessage('Please fill in all fields.');
      setIsLoading(false); // Stop loading
      return;
    }

    if (password.length < 6) {
      setMessage('Password is too short.');
      setIsLoading(false); // Stop loading
      return;
    }

    if (!captchaToken) {
      setMessage('Please complete the CAPTCHA.');
      setIsLoading(false); // Stop loading
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, captchaToken }),
      });

      const result = await response.json();
      if (!response.ok) {
        recaptchaRef.current?.reset();
        throw new Error(result.message);
      }
      router.push('/signup-confirm');
      return;
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during sign up.');
    } finally {
      setIsLoading(false); // Stop loading irrespective of the result
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-normal bg-gray-100" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div id="spacer" className="p-8"></div>
        <div className="max-w-lg w-full mx-auto p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center text-gray-700 mb-8">Sign Up</h2>
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
              onChange={setCaptchaToken}
              onExpired={onRecaptchaExpired}
            />
            <div>
              {isLoading ? (
                <Spinner />
              ) : (
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                >
                  Sign Up
                </button>
              )}
            </div>
          </form>
          {message && (
            <p className={`${message === "Signing up..." ? "text-blue-500" : "text-red-500"} text-center mt-2`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default SignUp;
