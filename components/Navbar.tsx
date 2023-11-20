// components/Navbar.tsx

const Navbar: React.FC = () => {
    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between">
                <a href="/signup" className="hover:text-gray-300">Signup</a>
                <a href="/login" className="hover:text-gray-300">Login</a>
                <a href="/protected" className="hover:text-gray-300">Protected</a>
            </div>
        </nav>
    );
};

export default Navbar;
