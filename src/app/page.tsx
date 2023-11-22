import Navbar from '../components/Navbar';

const Home: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 border rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold text-center">Hello World!</h1>
                </div>
            </div>
        </>
    );
};

export default Home;
