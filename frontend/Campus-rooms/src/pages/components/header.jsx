
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div>
        <header className='bg-gray-200 h-20 flex items-center shadow-lg'>
            <h1 className='p-3'>
                <Link to="/" className="hover:pointer">
                  <span className='font-bold text-[25px]'>Campus</span>
                  <span className='font-bold text-[25px] text-red-900'>Rooms</span>
                  <span className='font-bold text-[25px] text-green-800'>Ke</span>
                </Link>
                <hr />
            </h1>
        </header>
      
    </div>
  )
}

export default Header
