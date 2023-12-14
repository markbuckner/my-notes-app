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
                    <p className="mt-2 text-justify max-w-prose mx-auto">This web app allows users to manage their own notes. It is built with <a href="https://www.typescriptlang.org/" target="_blank" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Typescript</a>, <a href="https://nextjs.org/" target="_blank" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Next.js</a>, <a href="https://supabase.com/" target="_blank" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Supabase</a>, and <a href="https://tailwindcss.com/" target="_blank" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Tailwind CSS</a>. The app demonstrates <a href="https://en.wikipedia.org/wiki/Create,_read,_update_and_delete" target="_blank" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">CRUD</a> by allowing users to <b>create</b>, <b>read</b>, <b>update</b>, and <b>delete</b> notes.</p>
                </div>
            </div>
        </>
    );
};

export default withAuth(Home);
