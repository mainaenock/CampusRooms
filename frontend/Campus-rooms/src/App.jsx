import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Registration from './pages/Registration.jsx'
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './pages/components/protectedRoutes.jsx';
import ForgotPassword from './pages/forgotPassword.jsx';
import ResetPassword from './pages/resetPassword.jsx';
import LandingPage from './pages/LandingPage.jsx';

import Listings from './pages/Listings.jsx';
import MyListings from './pages/landlord/MyListings.jsx';
import NewListing from './pages/landlord/NewListing.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProtectedRoute from './pages/admin/AdminProtectedRoute.jsx';




const App = () => {
  return (
    
   <BrowserRouter>
    <Toaster position="top-center" />
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/listings' element={<Listings />} />
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
      <Route path='/landlord/listings' element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
      <Route path='/landlord/new-listing' element={<ProtectedRoute><NewListing /></ProtectedRoute>} />
      <Route path='/admin/dashboard' element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
    </Routes>
   </BrowserRouter>
  )
}

export default App
