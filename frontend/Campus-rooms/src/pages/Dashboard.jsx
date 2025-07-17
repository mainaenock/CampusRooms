import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentWelcomeModal from '../components/StudentWelcomeModal'

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate()
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Welcome, {user?.name}</h1>
      <p>Your role: {user?.role}</p>
      
      {/* Student-specific content */}
      {user?.role === 'student' && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">🏠 Help Your Fellow Students!</h3>
          <p className="text-gray-700 mb-3">
            Found an occupied property or misleading listing? Help other students by flagging it!
          </p>
          <button
            onClick={() => setShowWelcomeModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Learn How to Flag Properties
          </button>
        </div>
      )}
      
      <button 
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Logout
      </button>

      {/* Student Welcome Modal */}
      <StudentWelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
      />
    </div>
  )
}

export default Dashboard
