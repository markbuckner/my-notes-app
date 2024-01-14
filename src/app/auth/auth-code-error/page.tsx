"use client";
import React from 'react';
import Navbar from '../../../components/Navbar';

const AuthCodeError: React.FC = () => {

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-normal bg-gray-100" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div id="spacer" className="p-8"></div>
        <div className="bg-white p-8 border rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Auth Code Error</h2>
          <p className='text-justify'>Something went wrong in the authentication process. You may try signing up or logging in again.</p>
        </div>
      </div>
    </>
  );
};

export default AuthCodeError;
