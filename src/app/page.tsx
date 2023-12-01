"use client";
import Navbar from '../components/Navbar';
import withAuth from '../components/WithAuth';

const Home: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 border rounded-lg shadow-lg max-w-xl mx-auto">
                    <h1 className="text-4xl font-bold text-center">Hello World!</h1>
                    <p className="mt-2 text-justify max-w-prose mx-auto">This is a simple Next.js app with a Supabase backend for authentication and a Postgres database for storing notes! It demonstrates <b>CRUD</b> by allowing users to <b>create</b>, <b>read</b>, <b>update</b>, and <b>delete</b> notes.</p>
                </div>
            </div>
        </>
    );
};

export default withAuth(Home);
