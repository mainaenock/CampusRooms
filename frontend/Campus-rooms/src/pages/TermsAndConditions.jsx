import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="mt-4">
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to CampusRooms. These Terms and Conditions govern your use of our platform 
              and services. By accessing or using CampusRooms, you agree to be bound by these terms. 
              If you disagree with any part of these terms, you may not access our service.
            </p>
          </section>

          {/* Definitions */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Definitions</h2>
            <div className="space-y-3">
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                To use certain features of CampusRooms, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Providing accurate and complete information during registration</li>
                <li>Maintaining the security of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Being at least 18 years old to create an account</li>
              </ul>
            </div>
          </section>

          {/* Student Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Student Responsibilities</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                As a student using CampusRooms, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Provide accurate personal information and preferences</li>
                <li>Use the platform for legitimate accommodation searches only</li>
                <li>Respect landlords' time and respond promptly to inquiries</li>
                <li>Report any suspicious or inappropriate listings through the flagging system</li>
                <li>Not engage in harassment or discriminatory behavior</li>
                <li>Verify property details before making any commitments</li>
                <li>Understand that CampusRooms is a listing platform, not a rental agency</li>
              </ul>
            </div>
          </section>

          {/* Landlord Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Landlord Responsibilities</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                As a landlord using CampusRooms, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Provide accurate and up-to-date property information</li>
                <li>Include clear, recent photographs of the property</li>
                <li>Disclose all relevant property details and conditions</li>
                <li>Respond promptly to student inquiries</li>
                <li>Maintain properties in safe and habitable conditions</li>
                <li>Comply with all local housing laws and regulations</li>
                <li>Not discriminate based on race, religion, gender, or other protected characteristics</li>
                <li>Update listing status when properties become unavailable</li>
              </ul>
            </div>
          </section>

          {/* Flagging System */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Flagging System and Property Removal</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                CampusRooms operates a flagging system to maintain platform quality:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Students may flag listings for reasons including: occupied, problematic, or inappropriate content</li>
                <li>Flags are reviewed by administrators for validity</li>
                <li><strong>Properties with 5 or more valid flags become eligible for removal from the platform</strong></li>
                <li>Landlords will be notified via WhatsApp when their properties are flagged</li>
                <li>Repeated violations may result in account suspension or termination</li>
                <li>Landlords may appeal flag decisions through our support system</li>
              </ul>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Prohibited Activities</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Users are prohibited from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Posting false or misleading information</li>
                <li>Harassing or threatening other users</li>
                <li>Using the platform for illegal activities</li>
                <li>Attempting to circumvent the flagging system</li>
                <li>Creating multiple accounts to manipulate ratings or flags</li>
                <li>Sharing personal information of other users without consent</li>
                <li>Using automated systems to access the platform</li>
                <li>Posting inappropriate or offensive content</li>
              </ul>
            </div>
          </section>

          {/* Privacy and Data */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Privacy and Data Protection</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Your privacy is important to us. Please review our Privacy Policy for details on:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>How we collect and use your personal information</li>
                <li>Data sharing practices with landlords and students</li>
                <li>Your rights regarding your personal data</li>
                <li>Security measures to protect your information</li>
                <li>Use of cookies and tracking technologies</li>
              </ul>
            </div>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Payment and Financial Terms</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                CampusRooms may offer premium features or services:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>All payments are processed securely through authorized payment gateways</li>
                <li>Prices are subject to change with prior notice</li>
                <li>Refunds are processed according to our refund policy</li>
                <li>Users are responsible for any applicable taxes</li>
                <li>Premium features are non-transferable</li>
              </ul>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Disclaimers and Limitations</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                CampusRooms provides a platform for connecting students and landlords:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>We do not guarantee the accuracy of property listings</li>
                <li>We are not responsible for rental agreements or disputes between users</li>
                <li>We do not conduct background checks on users</li>
                <li>Users should verify all information independently</li>
                <li>We are not liable for any damages arising from use of the platform</li>
                <li>Our liability is limited to the amount paid for our services</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Account Termination</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                We may terminate or suspend accounts for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Violation of these terms and conditions</li>
                <li>Repeated flagging of properties</li>
                <li>Fraudulent or illegal activities</li>
                <li>Harassment of other users</li>
                <li>Failure to maintain account security</li>
                <li>At our discretion for any other reason</li>
              </ul>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting. Continued use of the platform constitutes acceptance of 
              modified terms. Users will be notified of significant changes via email or platform notification.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                For questions about these terms, contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> support@campusrooms.com<br />
                  <strong>Phone:</strong> +254 XXX XXX XXX<br />
                  <strong>Address:</strong> [Your Business Address]
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t pt-8 mt-8">
            <p className="text-sm text-gray-500 text-center">
              By using CampusRooms, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions; 