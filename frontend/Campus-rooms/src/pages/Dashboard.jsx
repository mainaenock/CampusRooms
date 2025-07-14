import React from 'react'

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  navigate('/login');
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Welcome, {user?.name}</h1>
      <p>Your role: {user?.role}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard
