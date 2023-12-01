"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '../../components/Navbar';
import LogoutButton from '../../components/LogoutButton';
import withAuth from '../../components/WithAuth';


const Protected: React.FC<{ isLoggedIn: boolean }> = ( { isLoggedIn }) => {
  const [username, setUsername] = useState<string>('');
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  );

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();

      if (error || !sessionData.session || !sessionData.session.user) {
        router.push('/login');
        return;
      }

      setUsername(sessionData.session.user.email || 'No email found');
    };

    checkSession();
  }, [router]);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="flex min-h-screen bg-gray-100 justify-center items-center">
        <div className="bg-white p-8 border rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Page</h2>
          {username ? (
            <>
              <p className="border p-4 rounded-lg">Your username is {username}</p>
              <LogoutButton />
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default withAuth(Protected);
