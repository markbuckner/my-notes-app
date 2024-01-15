"use client";

import React from 'react';
import Navbar from '../../components/Navbar';
import LogoutButton from '../../components/LogoutButton';

const LogoutConfirmationPage: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-normal bg-gray-100" style={{ minHeight: 'calc(100vh - 64px)' }}>
                <div id="spacer" className="p-8"></div>
                <div className="bg-white p-8 border rounded-lg shadow-lg max-w-lg w-full text-center">
                    <h2 className="text-3xl font-bold mb-4">Logout Confirmation</h2>
                    <p>Are you sure you want to logout?</p>
                    <LogoutButton />
                </div>
            </div>
        </>
    );
};

export default LogoutConfirmationPage;
