// pages/index.tsx

import Navbar from '../components/Navbar';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow flex items-center justify-center">
                <h1 className="text-4xl font-bold">Hello World!</h1>
            </div>
        </div>
    );
};

export default Home;
