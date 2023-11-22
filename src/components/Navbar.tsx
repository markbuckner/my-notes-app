const Navbar: React.FC = () => {
    return (
      <nav className="bg-white shadow-md border-b-4 border-blue-500">
        <div className="container mx-auto px-6 py-3 flex items-center">
          <a href="/" className="text-gray-800 font-semibold py-2 px-4 hover:text-purple-700 transition duration-300 ease-in-out">Home</a>
          <span className="text-gray-400 mx-3">|</span>
          <a href="/signup" className="text-gray-800 font-semibold py-2 px-4 hover:text-purple-700 transition duration-300 ease-in-out">Sign Up</a>
          <span className="text-gray-400 mx-3">|</span>
          <a href="/login" className="text-gray-800 font-semibold py-2 px-4 hover:text-purple-700 transition duration-300 ease-in-out">Login</a>
          <span className="text-gray-400 mx-3">|</span>
          <a href="/notes" className="text-gray-800 font-semibold py-2 px-4 hover:text-purple-700 transition duration-300 ease-in-out">Notes</a>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  