"use client";

import React from 'react';
import Navbar from '../../components/Navbar';
import LogoutButton from '../../components/LogoutButton';
import withAuth from '../../components/WithAuth';

const LogoutConfirmationPage: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} />
            <div className="flex min-h-screen bg-gray-100 justify-center items-center">
                <div className="bg-white p-8 border rounded-lg shadow-lg max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold mb-4">Logout Confirmation</h2>
                    <p>Are you sure you want to logout?</p>
                    <LogoutButton />
                </div>
            </div>
        </>
    );
};

export default withAuth(LogoutConfirmationPage);
