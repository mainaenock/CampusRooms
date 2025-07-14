
import { Link } from 'react-router-dom';

const LandingHeader = () => (
  <header className="w-full bg-white shadow-md py-4 px-8 flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <h2>
         <span className='font-bold text-[25px]'>Campus</span>
           <span className='font-bold text-[25px] text-red-900'>Rooms</span>
           <span className='font-bold text-[25px] text-green-800'>Ke</span>
           <hr />
      </h2>
      
          
    </div>
    <nav className="flex items-center space-x-4">
      <Link to="/login" className="px-4 py-2 rounded-md text-blue-700 font-semibold hover:bg-blue-50 transition">Log in</Link>
      <Link to="/reg" className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Sign up</Link>
    </nav>
  </header>
);

export default LandingHeader;
