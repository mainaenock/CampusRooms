import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const getFirstName = (user) => {
  if (user?.firstName) return user.firstName;
  if (user?.name) return user.name.split(' ')[0];
  return 'User';
};

const ProfileMenu = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const firstName = getFirstName(user);
  return (
    <div className="relative ml-2 sm:ml-4">
      <button
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-blue-100 rounded-full hover:bg-blue-200 focus:outline-none text-xs sm:text-sm md:text-base"
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-semibold text-blue-800 hidden xs:inline">Hello {firstName}</span>
        <span className="bg-blue-700 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-bold">
          {firstName[0]?.toUpperCase() || 'U'}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-32 sm:w-40 bg-white border rounded shadow-lg z-10 text-xs sm:text-sm">
          <Link to="/profile" className="block px-3 sm:px-4 py-2 hover:bg-gray-100">Profile</Link>
          <button onClick={onLogout} className="block w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 text-red-600">Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
