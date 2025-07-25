import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'
import StudentWelcomeModal from '../../components/StudentWelcomeModal'
import BackButton from '../../components/BackButton'
import API_BASE_URL from '../../config/api';

const LoginContainer = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const navigate = useNavigate()

  const togglePassword = () => setShowPassword(prev => !prev)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      return toast.error('Please fill in all fields.')
    }

    const toastId = toast.loading('Logging in...')
    setLoading(true)

    try {
      const res = await axios.post(`${API_BASE_URL}/cr/reg/login`, { email, password })
  localStorage.setItem('user', JSON.stringify(res.data.user));
  localStorage.setItem('token', res.data.token);

      toast.success('Login successful!', { id: toastId })
      
      // Check if user has seen the welcome modal before
      const hasSeenWelcome = localStorage.getItem('hasSeenStudentWelcome');
      
      if (res.data.user && res.data.user.role === 'student' && !hasSeenWelcome) {
        // Show welcome modal for students who haven't seen it
        setShowWelcomeModal(true);
      } else {
        // Navigate immediately for non-students or students who have seen the modal
        setTimeout(() => {
          if (res.data.user && res.data.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else if (res.data.user && res.data.user.role === 'landlord') {
            navigate('/');
          } else {
            navigate('/');
          }
        }, 2000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      toast.error(msg, { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <BackButton />
        </div>
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password + Emoji Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-3 top-1/2 -translate-y-1/2 text-xl"
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>


          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md text-white transition duration-200 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        {/* Register Link */}
        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/reg" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>

      {/* Student Welcome Modal */}
      <StudentWelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => {
          setShowWelcomeModal(false);
          // Mark that user has seen the welcome modal
          localStorage.setItem('hasSeenStudentWelcome', 'true');
          // Navigate after closing modal
          setTimeout(() => {
            navigate('/');
          }, 500);
        }}
      />
    </div>
  )
}

export default LoginContainer
