"use client";

import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

const LogoutButton: React.FC = () => {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 mt-4"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
