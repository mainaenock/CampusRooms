import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
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
              CampusRooms ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our platform 
              and services. By using CampusRooms, you consent to the data practices described in this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-700 mb-4">
              We collect personal information that you provide directly to us:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
              <li><strong>Account Information:</strong> Name, email address, phone number, password</li>
              <li><strong>Profile Information:</strong> Profile pictures, preferences, university/college details</li>
              <li><strong>Property Information:</strong> Property details, photos, descriptions, pricing (for landlords)</li>
              <li><strong>Communication Data:</strong> Messages, inquiries, and chat conversations</li>
              <li><strong>Payment Information:</strong> Payment method details (processed securely through payment gateways)</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
            <p className="text-gray-700 mb-4">
              We automatically collect certain information when you use our platform:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, search queries, interactions</li>
              <li><strong>Location Data:</strong> General location information (with your consent)</li>
              <li><strong>Cookies and Tracking:</strong> Session cookies, analytics cookies, preference cookies</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">2.3 Third-Party Information</h3>
            <p className="text-gray-700">
              We may receive information from third-party sources such as:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Social media platforms (if you connect your account)</li>
              <li>Payment processors and financial institutions</li>
              <li>Analytics and advertising partners</li>
              <li>Public databases and directories</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Platform Operation:</strong> Providing, maintaining, and improving our services</li>
              <li><strong>User Communication:</strong> Sending notifications, updates, and support messages</li>
              <li><strong>Property Matching:</strong> Connecting students with suitable accommodations</li>
              <li><strong>Safety and Security:</strong> Preventing fraud, abuse, and ensuring platform safety</li>
              <li><strong>Customer Support:</strong> Responding to inquiries and providing assistance</li>
              <li><strong>Analytics:</strong> Understanding usage patterns and improving user experience</li>
              <li><strong>Legal Compliance:</strong> Meeting legal obligations and enforcing our terms</li>
              <li><strong>Marketing:</strong> Sending promotional materials (with your consent)</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 With Other Users</h3>
            <p className="text-gray-700 mb-4">
              We share certain information between users to facilitate connections:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
              <li><strong>Property Listings:</strong> Landlord information and property details are visible to students</li>
              <li><strong>Student Profiles:</strong> Basic student information is shared with landlords during inquiries</li>
              <li><strong>Chat Messages:</strong> Direct messages are shared between connected users</li>
              <li><strong>Reviews and Ratings:</strong> Public reviews and ratings are visible to all users</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">4.2 With Service Providers</h3>
            <p className="text-gray-700 mb-4">
              We share information with trusted third-party service providers:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
              <li>Payment processors for secure transactions</li>
              <li>Cloud hosting providers for data storage</li>
              <li>Analytics services for platform improvement</li>
              <li>Email and messaging services for communications</li>
              <li>Customer support tools for assistance</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">4.3 Legal Requirements</h3>
            <p className="text-gray-700">
              We may disclose your information when required by law or to protect our rights:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Compliance with legal obligations</li>
              <li>Protection of user safety and platform security</li>
              <li>Enforcement of our Terms and Conditions</li>
              <li>Response to legal requests and court orders</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to protect your information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Encryption:</strong> Data is encrypted in transit and at rest</li>
              <li><strong>Access Controls:</strong> Limited access to personal information on a need-to-know basis</li>
              <li><strong>Regular Security Audits:</strong> Periodic security assessments and updates</li>
              <li><strong>Secure Infrastructure:</strong> Hosting on secure, reliable cloud platforms</li>
              <li><strong>Employee Training:</strong> Regular security training for our team</li>
              <li><strong>Incident Response:</strong> Procedures for handling security incidents</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your information for as long as necessary to provide our services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Account Data:</strong> Retained while your account is active and for a reasonable period after deactivation</li>
              <li><strong>Property Listings:</strong> Retained while active and for compliance purposes</li>
              <li><strong>Communication Data:</strong> Retained for service provision and dispute resolution</li>
              <li><strong>Payment Information:</strong> Retained as required by financial regulations</li>
              <li><strong>Analytics Data:</strong> Retained for platform improvement and analytics</li>
              <li><strong>Legal Requirements:</strong> Retained as required by applicable laws</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Privacy Rights</h2>
            <p className="text-gray-700 mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Restriction:</strong> Limit how we process your information</li>
              <li><strong>Objection:</strong> Object to certain processing activities</li>
              <li><strong>Withdrawal:</strong> Withdraw consent for marketing communications</li>
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to enhance your experience:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You can control cookie settings through your browser preferences. However, disabling certain cookies 
              may affect platform functionality.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              Our platform may contain links to third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Payment Processors:</strong> M-Pesa, PayPal, and other payment services</li>
              <li><strong>Social Media:</strong> Facebook, Twitter, Instagram integration</li>
              <li><strong>Analytics:</strong> Google Analytics and similar services</li>
              <li><strong>Advertising:</strong> Google Ads and other advertising networks</li>
            </ul>
            <p className="text-gray-700 mt-4">
              These services have their own privacy policies. We encourage you to review them before providing 
              any personal information.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700">
              CampusRooms is not intended for children under 18 years of age. We do not knowingly collect 
              personal information from children under 18. If you believe we have collected information from 
              a child under 18, please contact us immediately, and we will take steps to remove such information.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. International Data Transfers</h2>
            <p className="text-gray-700">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your information in accordance 
              with this Privacy Policy and applicable data protection laws.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of any material changes 
              by posting the new policy on our platform and updating the "Last updated" date. Your continued 
              use of CampusRooms after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> campusroomske@gmail.com<br />
                <strong>Phone:</strong> +254 113602658<br />
               
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t pt-8 mt-8">
            <p className="text-sm text-gray-500 text-center">
              This Privacy Policy is effective as of the date listed above and applies to all users of CampusRooms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 