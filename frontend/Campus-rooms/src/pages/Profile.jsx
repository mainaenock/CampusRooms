import React from 'react';
import Header from './components/header';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <div className="p-8">Not logged in.</div>;
  return (
    <div>
      <Header />
      <div className="max-w-md mx-auto mt-10 bg-white rounded shadow p-6 pt-24">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">My Profile</h2>
        <div className="mb-2"><span className="font-semibold">Name:</span> {user.name}</div>
        <div className="mb-2"><span className="font-semibold">Email:</span> {user.email}</div>
        <div className="mb-2"><span className="font-semibold">Role:</span> {user.role}</div>
      </div>
    </div>
  );
};

export default Profile;
