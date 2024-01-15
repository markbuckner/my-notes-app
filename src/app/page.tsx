"use client";
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-normal bg-gray-100" style={{ minHeight: 'calc(100vh - 64px)' }}>
                <div id="spacer" className="p-8"></div>
                <div className="bg-white p-8 border rounded-lg shadow-lg max-w-xl mx-auto text-center">
                    <h1 className="text-3xl font-bold">My Quick Notes 📝</h1>
                    <p className="mt-2 text-justify max-w-prose mx-auto">This web app allows users to manage their own notes. It is built with <a href="https://www.typescriptlang.org/" target="_blank" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Typescript</a>, <a href="https://nextjs.org/" target="_blank" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Next.js</a>, <a href="https://supabase.com/" target="_blank" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Supabase</a>, and <a href="https://tailwindcss.com/" target="_blank" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Tailwind CSS</a>. The app demonstrates <a href="https://en.wikipedia.org/wiki/Create,_read,_update_and_delete" target="_blank" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">CRUD</a> by allowing users to <b>create</b>, <b>read</b>, <b>update</b>, and <b>delete</b> notes.</p>

                    {/* GitHub Repo Link Button */}
                    <a href="https://github.com/markbuckner/my-notes-app" target="_blank" className="mt-4 inline-block bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition duration-300">
                        View on GitHub
                    </a>
                </div>
            </div>
        </>
    );
};

export default Home;
