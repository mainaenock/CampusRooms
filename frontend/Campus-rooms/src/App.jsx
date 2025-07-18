import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Registration from './pages/Registration.jsx'
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './pages/components/protectedRoutes.jsx';
import ForgotPassword from './pages/forgotPassword.jsx';
import ResetPassword from './pages/resetPassword.jsx';
import LandingPage from './pages/LandingPage.jsx';
import ListingDetails from './pages/ListingDetails.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import FAQ from './pages/FAQ.jsx';
import TermsAndConditions from './pages/TermsAndConditions.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';

import MyListings from './pages/landlord/MyListings.jsx';
import NewListing from './pages/landlord/NewListing.jsx';
import EditListing from './pages/landlord/EditListing.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProtectedRoute from './pages/admin/AdminProtectedRoute.jsx';
import Profile from './pages/Profile.jsx';
import AdminLandlordListings from './pages/admin/AdminLandlordListings.jsx';

import LandlordChatRoom from './pages/landlord/LandlordChatRoom.jsx';
import Messages from './pages/Messages.jsx';
import MpesaPayment from './pages/components/MpesaPayment.jsx';

// New imports for performance and caching
import CookieConsent from './components/CookieConsent.jsx';
import performanceMonitor from './services/PerformanceMonitor.js';
import smartCache from './services/SmartCache.js';

const App = () => {
  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitor.trackPageView('app_initialized');
    
    // Initialize smart cache and preload data
    smartCache.preloadData();
    
    // Register service worker for offline functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
          performanceMonitor.trackEvent('service_worker_registered');
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
          performanceMonitor.trackEvent('service_worker_failed', { error: error.message });
        });
    }

    // Track app initialization
    performanceMonitor.trackEvent('app_loaded', {
      userAgent: navigator.userAgent,
      online: navigator.onLine,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink
      } : null
    });

    // Listen for online/offline events
    const handleOnline = () => {
      performanceMonitor.trackEvent('connection_restored');
      smartCache.preloadData(); // Refresh cache when back online
    };

    const handleOffline = () => {
      performanceMonitor.trackEvent('connection_lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <CookieConsent />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/reg' element={<Registration />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path='/terms' element={<TermsAndConditions />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
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
        <Route path='/admin/landlord-listings/:landlordId' element={<AdminProtectedRoute><AdminLandlordListings /></AdminProtectedRoute>} />
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
