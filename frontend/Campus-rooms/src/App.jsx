import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Registration from './pages/Registration.jsx'
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './pages/components/protectedRoutes.jsx';
import ForgotPassword from './pages/forgotPassword.jsx';
import ResetPassword from './pages/resetPassword.jsx';


const App = () => {
  return (
    
   <BrowserRouter>
    <Toaster position="top-center" />
    <Routes>
      <Route path='/reg' element={<Registration />} />
      <Route path='/login' element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

    </Routes>
   </BrowserRouter>
  )
}

export default App
