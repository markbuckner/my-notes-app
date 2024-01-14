"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import LogoutButton from '../../components/LogoutButton';
import { useAuth } from '../../components/AuthContext';
import { useNotes } from '../../components/NotesContext';

const Profile: React.FC = () => {
  const router
    = useRouter();
  const { isLoggedIn, isLoading: isAuthLoading, userName } = useAuth();
  const { notes } = useNotes();

  // Redirect to login if not logged in
  if (!isLoggedIn && !isAuthLoading) {
    router.push('/login');
    return null; // Render nothing while redirecting
  }

  // Set context variables provided by AuthContext and NotesContext
  const username = userName;
  const notesCount = notes.length;

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-normal bg-gray-100" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div id="spacer" className="p-8"></div>
        <div className="bg-white p-8 border rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Page</h2>
          <p className="border p-4 rounded-lg text-center"> Username: {username} <br />
            Note count: <strong>{notesCount}</strong>
          </p>
          <p className="mt-4"></p>
          {/* Go to my notes Button */}
          <Link href="/notes" passHref>
            <button className="w-full bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600 mt-4">
              Go to my notes
            </button>
          </Link>

          <LogoutButton />

          {/* Add Reset Password Button */}
          <Link href="/auth/request-reset" passHref>
            <button className="w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 mt-4">
              Reset Password
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Profile;