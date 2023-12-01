"use client";
import Navbar from '../components/Navbar';
import withAuth from '../components/WithAuth';
const Home: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 border rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold text-center">Hello World!</h1>
                    <p className="mt-2">This is a simple Next.js app with a Supabase backend for authentication and a Postgres database! It demonstrates CRUD by allowing users to create, read, update, and delete notes.</p>
                </div>
            </div>
        </>
    );
};

export default withAuth(Home);
