import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Registration from './pages/Registration.jsx'
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './pages/components/protectedRoutes.jsx';
import ForgotPassword from './pages/forgotPassword.jsx';
import ResetPassword from './pages/resetPassword.jsx';
import LandingPage from './pages/LandingPage.jsx';
import ListingDetails from './pages/ListingDetails.jsx';



import MyListings from './pages/landlord/MyListings.jsx';
import NewListing from './pages/landlord/NewListing.jsx';
import EditListing from './pages/landlord/EditListing.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProtectedRoute from './pages/admin/AdminProtectedRoute.jsx';
import Profile from './pages/Profile.jsx';

import LandlordChatRoom from './pages/landlord/LandlordChatRoom.jsx';
import Messages from './pages/Messages.jsx';
import MpesaPayment from './pages/components/MpesaPayment.jsx';




const App = () => {
  return (
    
   <BrowserRouter>
    <Toaster position="top-center" />
    <Routes>
      <Route path='/' element={<LandingPage />} />
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
  <Route path='/landlord/edit-listing/:id' element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
      <Route path='/admin/dashboard' element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
      <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path='/listing-details' element={<ListingDetails />} />
      <Route path='/messages' element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path='/landlord/chat' element={<ProtectedRoute><LandlordChatRoom landlordId={(JSON.parse(localStorage.getItem('user'))?._id || JSON.parse(localStorage.getItem('user'))?.id)} /></ProtectedRoute>} />
      <Route path='/pay' element={<ProtectedRoute><MpesaPayment amount={1000} accountReference="CampusRooms" transactionDesc="Room Payment" /></ProtectedRoute>} />
    </Routes>
   </BrowserRouter>
  )
}

export default App
