import React, { useState } from 'react';
import Header from './components/header';
import StudentWelcomeModal from '../components/StudentWelcomeModal';
import BackButton from '../components/BackButton';
import { FaUserCircle, FaUserGraduate, FaUserTie, FaUserShield, FaEnvelope, FaFlag } from 'react-icons/fa';

const getAvatarColor = (name) => {
  const colors = [
    'bg-blue-200', 'bg-green-200', 'bg-purple-200', 'bg-pink-200', 'bg-yellow-200', 'bg-red-200', 'bg-indigo-200', 'bg-teal-200'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const getRoleIcon = (role) => {
  if (role === 'student') return <FaUserGraduate className="text-blue-600" />;
  if (role === 'landlord') return <FaUserTie className="text-green-700" />;
  if (role === 'admin') return <FaUserShield className="text-purple-700" />;
  return <FaUserCircle className="text-gray-400" />;
};

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  if (!user) return <div className="p-8">Not logged in.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <div className="max-w-lg mx-auto mt-40 bg-white rounded-2xl shadow-xl p-8 pt-20 relative">
        <div className="mb-4">
          <BackButton />
        </div>
        {/* Avatar */}
        <div className={`absolute -top-16 left-1/2 -translate-x-1/2 shadow-lg rounded-full border-4 border-white ${getAvatarColor(user.name || user.email || 'U')} w-32 h-32 flex items-center justify-center text-6xl`}> 
          {getRoleIcon(user.role)}
        </div>
        <h2 className="text-3xl font-bold mb-2 text-center text-blue-800 mt-2">{user.name}</h2>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            {getRoleIcon(user.role)}
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 mb-6">
          <FaEnvelope className="text-gray-400" />
          <span className="text-gray-700">{user.email}</span>
        </div>
        <div className="border-t border-gray-200 pt-6">
          {/* Show flagging info button for students */}
          {user.role === 'student' && (
            <div className="mb-6">
              <button
                onClick={() => setShowWelcomeModal(true)}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold flex items-center justify-center gap-2 shadow"
              >
                <FaFlag className="text-white" />
                View Flagging Information
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Learn how to help other students by flagging problematic properties
              </p>
            </div>
          )}
          {/* General info */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-700 w-24">Name:</span>
              <span className="text-gray-800">{user.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-700 w-24">Email:</span>
              <span className="text-gray-800">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-700 w-24">Role:</span>
              <span className="text-gray-800 capitalize">{user.role}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Student Welcome Modal */}
      <StudentWelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
      />
    </div>
  );
};

export default Profile;
