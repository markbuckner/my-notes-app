"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Navbar from '../../components/Navbar';
import LogoutButton from '../../components/LogoutButton';
import withAuth from '../../components/WithAuth';

const Profile: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  const [username, setUsername] = useState<string>('');
  const [notesCount, setNotesCount] = useState<number | string>("...");
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  );

  const fetchNotesCount = async () => {
    const { data: sessionData, error } = await supabase.auth.getSession();

    if (error || !sessionData.session || !sessionData.session.user) {
      console.error('Error fetching session:', error);
      return;
    }

    const user = sessionData.session.user;
    const { count, error: countError } = await supabase
      .from('notes')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);

    if (countError) {
      console.error('Error fetching notes count:', countError);
    } else {
      setNotesCount(count ?? "...");
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();

      if (error || !sessionData.session || !sessionData.session.user) {
        router.push('/login');
        return;
      }

      setUsername(sessionData.session.user.email || 'No email found');
      await fetchNotesCount();  // Fetch the notes count after checking the session
    };

    checkSession();
  }, [router]);
  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      
      <div className="flex flex-col items-center justify-normal min-h-screen bg-gray-100">
      <div id="spacer" className="p-8"></div>
        <div className="bg-white p-8 border rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Page</h2>
          {username ? (
            <>
              <p className="border p-4 rounded-lg">Your username is {username}</p>
              <p className="mt-4">You have <strong>{notesCount}</strong> {notesCount === 1 ? 'note' : 'notes'}.</p>
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

export default withAuth(Profile);
