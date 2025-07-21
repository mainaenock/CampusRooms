

import { Link, useNavigate } from 'react-router-dom';
import ProfileMenu from '../../components/ProfileMenu';
import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../../config/api';


const LandingHeader = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const userId = user._id || user.id;
    if (!userId) return;
    fetch(`${API_BASE_URL}/api/chat/unread-count?userId=${userId}`)
      .then(res => res.json())
      .then(data => setUnreadCount(data.count || 0))
      .catch(() => setUnreadCount(0));
  }, [user]);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };
  return (
    <header className="w-full bg-white shadow-md py-3 sm:py-4 px-2 sm:px-4 md:px-8 flex items-center justify-between fixed top-0 left-0 z-50" style={{right:0}}>
      <div className="flex items-center space-x-1 sm:space-x-2">
        <h2>
                      <Link to="/" className="flex items-center hover:opacity-80">
              <span className='font-bold text-lg sm:text-xl md:text-2xl lg:text-[25px] text-gray-800'>Campus</span>
              <span className='font-bold text-lg sm:text-xl md:text-2xl lg:text-[25px] text-red-900'>Rooms</span>
              <span className='font-bold text-lg sm:text-xl md:text-2xl lg:text-[25px] text-green-800'>Ke</span>
            </Link>
          <hr className="hidden sm:block" />
        </h2>
      </div>
      <nav className="flex items-center space-x-2 sm:space-x-4">
        {user ? (
          <>
            {user.role === 'landlord' ? (
              <button
                className="relative p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                title="Messages"
                onClick={() => navigate('/landlord/chat')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a3 3 0 003.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold min-w-[18px] text-center">{unreadCount}</span>
                )}
              </button>
            ) : (
              <button
                className="relative p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                title="Messages"
                onClick={() => navigate('/messages')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a3 3 0 003.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold min-w-[18px] text-center">{unreadCount}</span>
                )}
              </button>
            )}
            <ProfileMenu user={user} onLogout={handleLogout} />
          </>
        ) : (
          <>
            <Link to="/login" className="px-3 sm:px-4 py-2 rounded-md text-blue-700 font-semibold hover:bg-blue-50 transition text-sm sm:text-base">Log in</Link>
            <Link to="/reg" className="px-3 sm:px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-sm sm:text-base">Get Started</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default LandingHeader;
