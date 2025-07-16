import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from './components/header';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Cooldown effect
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cooldown > 0) return;

    try {
        await axios.post('https://28db47844d9d.ngrok-free.app/cr/reg/forgot-password', { email });
      toast.success('Reset link sent to your email');
      setCooldown(30); // Start cooldown after success
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    }
  };

  return (
    <>
    <Header />
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Enter your email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={cooldown > 0}
              className={`w-full font-medium py-2 px-4 rounded-md text-white transition duration-200 ${
                cooldown > 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {cooldown > 0 ? `Please wait ${cooldown}s` : 'Send Reset Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default ForgotPassword;
