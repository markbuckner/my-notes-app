"use client";
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';

const ConfirmEmailPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token_hash');
  const type = searchParams.get('type');

  // Push to confirm route with token hash and type as query params.
  const handleConfirmEmail = () => {
    router.push(`/auth/confirm?token_hash=${token}&type=${type}`)
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-normal bg-gray-100" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div id="spacer" className="p-8"></div>
        <div className="bg-white p-8 border rounded-lg shadow-lg max-w-lg w-[97%] text-center">
          <h2 className="text-3xl font-bold mb-4">Confirm Your Email</h2>
          <p>Click the button to confirm your email</p>
          <button onClick={handleConfirmEmail} className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 mt-4">
            Confirm
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmEmailPage;
