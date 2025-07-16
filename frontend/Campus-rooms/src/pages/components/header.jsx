
import { Link, useNavigate } from 'react-router-dom';
import ProfileMenu from '../../components/ProfileMenu';
import React from 'react';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <div>
      <header className='bg-gray-200 h-20 flex items-center shadow-lg justify-between px-6 fixed top-0 left-0 w-full z-50'>
        <h1 className='p-3'>
          <Link to="/" className="hover:pointer">
            <span className='font-bold text-[25px]'>Campus</span>
            <span className='font-bold text-[25px] text-red-900'>Rooms</span>
            <span className='font-bold text-[25px] text-green-800'>Ke</span>
          </Link>
        </h1>
        {user && (
          <ProfileMenu user={user} onLogout={handleLogout} />
        )}
      </header>
    </div>
  );
}

export default Header;
