import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import StudentWelcomeModal from '../../components/StudentWelcomeModal';

const RegContainer = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showStudentWelcomeModal, setShowStudentWelcomeModal] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(prev => !prev);

  // Google Sign-In handler
  const handleGoogleSignIn = async (googleUser) => {
    if (!role) {
      return toast.error('Please select your role (Student or Landlord) first.');
    }

    if (!agree) {
      return toast.error('You must agree to the terms and conditions.');
    }

    setGoogleLoading(true);
    const loadingToast = toast.loading('Signing in with Google...');

    try {
      const idToken = googleUser.credential;
      
      // Send Google token to backend for verification and registration
      const response = await axios.post('http://localhost:3000/cr/reg/google', {
        idToken,
        role
      });

      toast.success('Google Sign-In successful! Welcome to CampusRooms!', { id: loadingToast });
      
      // Store user data and token
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      
      // Check if user is a new student and show welcome modal
      const hasSeenWelcome = localStorage.getItem('hasSeenStudentWelcome');
      
      if (response.data.user && response.data.user.role === 'student' && !hasSeenWelcome) {
        // Show welcome modal for new students
        setShowStudentWelcomeModal(true);
      } else {
        // Navigate immediately for non-students or students who have seen the modal
        setTimeout(() => {
          if (response.data.user && response.data.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else if (response.data.user && response.data.user.role === 'landlord') {
            navigate('/');
          } else {
            navigate('/');
          }
        }, 2000);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Google Sign-In failed';
      toast.error(message, { id: loadingToast });
    } finally {
      setGoogleLoading(false);
    }
  };

  // Initialize Google Sign-In
  React.useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '317024847492-ks4abdu2k3bo15jol01o8ii3ipmvh1fo.apps.googleusercontent.com', 
          callback: handleGoogleSignIn,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          }
        );
      }
    };

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [role, agree]); // Re-initialize when role or agree changes

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !role || !email || !password) {
      return toast.error('Please fill in all fields.');
    }

    if (!agree) {
      return toast.error('You must agree to the terms and conditions.');
    }

    const loadingToast = toast.loading('Registering...');
    setLoading(true);

    const payload = { firstName, lastName, role, email, password };

    try {
      await axios.post('http://localhost:3000/cr/reg', payload);
      toast.success('Registered successfully! Welcome to CampusRooms!', { id: loadingToast });
      
      // Auto-login after successful registration
      try {
        const loginRes = await axios.post('http://localhost:3000/cr/reg/login', { 
          email, 
          password 
        });
        
        // Store user data and token
        localStorage.setItem('user', JSON.stringify(loginRes.data.user));
        localStorage.setItem('token', loginRes.data.token);
        
        // Check if user is a new student and show welcome modal
        const hasSeenWelcome = localStorage.getItem('hasSeenStudentWelcome');
        
        if (loginRes.data.user && loginRes.data.user.role === 'student' && !hasSeenWelcome) {
          // Show welcome modal for new students
          setShowStudentWelcomeModal(true);
        } else {
          // Navigate immediately for non-students or students who have seen the modal
          setTimeout(() => {
            if (loginRes.data.user && loginRes.data.user.role === 'admin') {
              navigate('/admin/dashboard');
            } else if (loginRes.data.user && loginRes.data.user.role === 'landlord') {
              navigate('/');
            } else {
              navigate('/');
            }
          }, 2000);
        }
      } catch (loginErr) {
        // If auto-login fails, redirect to login page
        console.error('Auto-login failed:', loginErr);
        toast.error('Registration successful! Please log in.', { id: loadingToast });
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <BackButton />
        </div>
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* First and Last Name */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-1">Role</p>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  id="student"
                  name="role"
                  value="student"
                  checked={role === 'student'}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Student</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  id="landlord"
                  name="role"
                  value="landlord"
                  checked={role === 'landlord'}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Landlord</span>
              </label>
            </div>
          </div>

          {/* Google Sign-In */}
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">Quick Sign-Up with Google</p>
            <div id="google-signin-button" className="w-full"></div>
            {googleLoading && (
              <div className="mt-2 text-center text-sm text-gray-600">
                Processing Google Sign-In...
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                id="password"
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

          {/* Terms & Conditions */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="form-checkbox text-blue-600"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Terms button clicked, opening modal');
                  setShowTermsModal(true);
                }}
                className="text-blue-600 underline cursor-pointer hover:text-blue-800"
              >
                Terms and Conditions
              </button>
            </label>
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
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>

          {/* Already have an account? */}
          <div className="text-sm text-center mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 underline hover:text-blue-800">
              Login
            </Link>
          </div>
        </form>
      </div>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          {console.log('Modal is rendering, showTermsModal:', showTermsModal)}
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" style={{ zIndex: 10000 }}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Terms and Conditions</h2>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Introduction */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Welcome to CampusRooms. These Terms and Conditions govern your use of our platform 
                    and services. By accessing or using CampusRooms, you agree to be bound by these terms. 
                    If you disagree with any part of these terms, you may not access our service.
                  </p>
                </section>

                {/* Definitions */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Definitions</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <strong>"Platform"</strong> refers to CampusRooms website and mobile application.
                    </p>
                    <p className="text-gray-700">
                      <strong>"User"</strong> refers to any individual who accesses or uses the Platform.
                    </p>
                    <p className="text-gray-700">
                      <strong>"Student"</strong> refers to users seeking accommodation.
                    </p>
                    <p className="text-gray-700">
                      <strong>"Landlord"</strong> refers to users offering accommodation for rent.
                    </p>
                    <p className="text-gray-700">
                      <strong>"Listing"</strong> refers to property advertisements posted by landlords.
                    </p>
                    <p className="text-gray-700">
                      <strong>"Flag"</strong> refers to reports submitted by students about problematic listings.
                    </p>
                  </div>
                </section>

                {/* User Accounts */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts</h3>
                  <p className="text-gray-700 mb-2">
                    To use certain features of CampusRooms, you must create an account. You are responsible for:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Providing accurate and complete information during registration</li>
                    <li>Maintaining the security of your account credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying us immediately of any unauthorized use</li>
                    <li>Being at least 18 years old to create an account</li>
                  </ul>
                </section>

                {/* Student Responsibilities */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Student Responsibilities</h3>
                  <p className="text-gray-700 mb-2">
                    As a student using CampusRooms, you agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Provide accurate personal information and preferences</li>
                    <li>Use the platform for legitimate accommodation searches only</li>
                    <li>Respect landlords' time and respond promptly to inquiries</li>
                    <li>Report any suspicious or inappropriate listings through the flagging system</li>
                    <li>Not engage in harassment or discriminatory behavior</li>
                    <li>Verify property details before making any commitments</li>
                    <li>Understand that CampusRooms is a listing platform, not a rental agency</li>
                  </ul>
                </section>

                {/* Landlord Responsibilities */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Landlord Responsibilities</h3>
                  <p className="text-gray-700 mb-2">
                    As a landlord using CampusRooms, you agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Provide accurate and up-to-date property information</li>
                    <li>Include clear, recent photographs of the property</li>
                    <li>Disclose all relevant property details and conditions</li>
                    <li>Respond promptly to student inquiries</li>
                    <li>Maintain properties in safe and habitable conditions</li>
                    <li>Comply with all local housing laws and regulations</li>
                    <li>Not discriminate based on race, religion, gender, or other protected characteristics</li>
                    <li>Update listing status when properties become unavailable</li>
                  </ul>
                </section>

                {/* Flagging System */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Flagging System and Property Removal</h3>
                  <p className="text-gray-700 mb-2">
                    CampusRooms operates a flagging system to maintain platform quality:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Students may flag listings for reasons including: occupied, problematic, or inappropriate content</li>
                    <li>Flags are reviewed by administrators for validity</li>
                    <li><strong>Properties with 5 or more valid flags become eligible for removal from the platform</strong></li>
                    <li>Landlords will be notified via WhatsApp when their properties are flagged</li>
                    <li>Repeated violations may result in account suspension or termination</li>
                    <li>Landlords may appeal flag decisions through our support system</li>
                  </ul>
                </section>

                {/* Prohibited Activities */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Prohibited Activities</h3>
                  <p className="text-gray-700 mb-2">
                    Users are prohibited from:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Posting false or misleading information</li>
                    <li>Harassing or threatening other users</li>
                    <li>Using the platform for illegal activities</li>
                    <li>Attempting to circumvent the flagging system</li>
                    <li>Creating multiple accounts to manipulate ratings or flags</li>
                    <li>Sharing personal information of other users without consent</li>
                    <li>Using automated systems to access the platform</li>
                    <li>Posting inappropriate or offensive content</li>
                  </ul>
                </section>

                {/* Privacy and Data */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">8. Privacy and Data Protection</h3>
                  <p className="text-gray-700 mb-2">
                    Your privacy is important to us. Please review our Privacy Policy for details on:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>How we collect and use your personal information</li>
                    <li>Data sharing practices with landlords and students</li>
                    <li>Your rights regarding your personal data</li>
                    <li>Security measures to protect your information</li>
                    <li>Use of cookies and tracking technologies</li>
                  </ul>
                </section>

                {/* Payment Terms */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">9. Payment and Financial Terms</h3>
                  <p className="text-gray-700 mb-2">
                    CampusRooms may offer premium features or services:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>All payments are processed securely through authorized payment gateways</li>
                    <li>Prices are subject to change with prior notice</li>
                    <li>Refunds are processed according to our refund policy</li>
                    <li>Users are responsible for any applicable taxes</li>
                    <li>Premium features are non-transferable</li>
                  </ul>
                </section>

                {/* Disclaimers */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">10. Disclaimers and Limitations</h3>
                  <p className="text-gray-700 mb-2">
                    CampusRooms provides a platform for connecting students and landlords:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>We do not guarantee the accuracy of property listings</li>
                    <li>We are not responsible for rental agreements or disputes between users</li>
                    <li>We do not conduct background checks on users</li>
                    <li>Users should verify all information independently</li>
                    <li>We are not liable for any damages arising from use of the platform</li>
                    <li>Our liability is limited to the amount paid for our services</li>
                  </ul>
                </section>

                {/* Termination */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">11. Account Termination</h3>
                  <p className="text-gray-700 mb-2">
                    We may terminate or suspend accounts for:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Violation of these terms and conditions</li>
                    <li>Repeated flagging of properties</li>
                    <li>Fraudulent or illegal activities</li>
                    <li>Harassment of other users</li>
                    <li>Failure to maintain account security</li>
                    <li>At our discretion for any other reason</li>
                  </ul>
                </section>

                {/* Changes to Terms */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">12. Changes to Terms</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to modify these terms at any time. Changes will be effective 
                    immediately upon posting. Continued use of the platform constitutes acceptance of 
                    modified terms. Users will be notified of significant changes via email or platform notification.
                  </p>
                </section>

                {/* Contact Information */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">13. Contact Information</h3>
                  <p className="text-gray-700 mb-2">
                    For questions about these terms, contact us at:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">
                      <strong>Email:</strong> support@campusrooms.com<br />
                      <strong>Phone:</strong> +254 XXX XXX XXX<br />
                      <strong>Address:</strong> [Your Business Address]
                    </p>
                  </div>
                </section>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-2 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                By using CampusRooms, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Welcome Modal */}
      <StudentWelcomeModal
        isOpen={showStudentWelcomeModal}
        onClose={() => {
          setShowStudentWelcomeModal(false);
          // Mark that user has seen the welcome modal
          localStorage.setItem('hasSeenStudentWelcome', 'true');
          // Navigate after closing modal
          setTimeout(() => {
            navigate('/');
          }, 500);
        }}
      />
    </div>
  );
};

export default RegContainer;
