import React from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';

type NavbarProps = {
  onCreateNote?: () => void;
  isNotesPage?: boolean; // prop to check if it's the Notes page
};

const Navbar: React.FC<NavbarProps> = ({ onCreateNote, isNotesPage }) => {
  const { isLoggedIn, isLoading } = useAuth();
  if (isLoading) {
    return (
      <nav className="sticky top-0 z-20 bg-white shadow-md border-b-4 border-blue-500">
        <div className="container mx-auto px-6 py-2 flex flex-col md:flex-row items-center">
          <div className="flex flex-row items-center mb-1 md:mb-0">
            <Link href="/" className="invisible text-gray-800 font-semibold py-2 px-2 hover:text-purple-700 transition duration-300 ease-in-out">Home</Link>
          </div>
        </div>
      </nav>
    );
  }
  return (
    <nav className="sticky top-0 z-20 bg-white shadow-md border-b-4 border-blue-500">
      <div className="max-w-full mx-auto px-6 py-2 flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-row items-center mb-1 md:mb-0 space-x-2">
          <Link href="/" className="text-gray-800 font-semibold py-2 px-4 hover:text-purple-700 transition duration-300 ease-in-out">Home</Link>
          <span className="text-gray-400 mx-3">|</span>
          {isLoggedIn ? (
            <>
              <Link href="/logout-confirm" className="text-gray-800 font-semibold py-2 px-4 hover:text-purple-700 transition duration-300 ease-in-out">Logout</Link>
              <span className="text-gray-400 mx-3">|</span>
              <Link href="/profile" className="text-gray-800 font-semibold py-2 px-4 hover:text-purple-700 transition duration-300 ease-in-out">Profile</Link>
            </>
          ) : (
            <>
              <Link href="/signup" className="text-gray-800 font-semibold py-2 px-4 hover:text-purple-700 transition duration-300 ease-in-out">Signup</Link>
              <span className="text-gray-400 mx-3">|</span>
              <Link href="/login" className="text-gray-800 font-semibold py-2 px-4 hover:text-purple-700 transition duration-300 ease-in-out">Login</Link>
            </>
          )}
          <span className="text-gray-400 mx-3">|</span>
          <Link href="/notes" className="text-gray-800 font-semibold py-2 px-2 hover:text-purple-700 transition duration-300 ease-in-out">Notes</Link>
        </div>
        {isLoggedIn && isNotesPage && onCreateNote && (
          <div className="flex flex-row-reverse md:flex-row md:ml-auto">
            <button
              onClick={onCreateNote}
              className="bg-blue-500 text-white rounded-md px-8 py-1 hover:bg-blue-600 transition duration-300 ease-in-out">
              📝 New Note
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;