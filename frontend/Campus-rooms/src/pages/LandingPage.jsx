
import LandingHeader from './components/LandingHeader';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <LandingHeader />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-blue-800 mb-4 text-center">
          Find Your Next Campus Home
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 mb-8 text-center max-w-2xl">
          Discover, compare, and book student accommodation near your campus. Simple, secure, and trusted by students and landlords alike.
        </p>
        <div className="flex space-x-4">
          <Link to="/reg" className="px-8 py-3 rounded-lg bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition">Get Started</Link>
          <Link to="/login" className="px-8 py-3 rounded-lg border border-blue-600 text-blue-700 font-bold text-lg shadow hover:bg-blue-50 transition">Log in</Link>
        </div>
      </main>
      <footer className="w-full py-6 text-center text-gray-400 text-sm border-t mt-12">
        &copy; {new Date().getFullYear()} CampusRooms. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
