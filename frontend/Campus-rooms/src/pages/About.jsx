import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaHome, FaUsers, FaShieldAlt, FaHeart, FaStar } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center gap-4">
          <Link
            to="/"
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
          >
            <FaArrowLeft className="text-xl" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <FaHome className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">About CampusRooms</h1>
              <p className="text-gray-500 dark:text-gray-400">Your trusted platform for student housing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Mission Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              To connect students with safe, affordable, and comfortable housing options near their universities, 
              making the transition to campus life seamless and enjoyable.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Our Story</h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                CampusRooms was born from the recognition that finding suitable student accommodation 
                can be one of the most challenging aspects of university life. Many students struggle 
                with limited housing options, high costs, and concerns about safety and proximity to campus.
              </p>
              <p>
                Our platform was designed to bridge this gap by creating a comprehensive marketplace 
                where students can easily discover, compare, and secure housing that meets their needs 
                and budget. We work with verified landlords to ensure quality accommodations and 
                provide students with the tools they need to make informed decisions.
              </p>
              <p>
                Since our launch, we've helped thousands of students find their perfect campus home, 
                building a community of satisfied students and trusted landlords across Kenya's 
                major university towns.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">Our Values</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Trust & Safety</h4>
              <p className="text-gray-600 dark:text-gray-300">
                We prioritize the safety and security of our students by thoroughly vetting all 
                properties and landlords on our platform.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-2xl text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Student-First</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Every feature and decision is made with students' needs in mind, ensuring 
                affordability, convenience, and quality.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-2xl text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Community</h4>
              <p className="text-gray-600 dark:text-gray-300">
                We believe in building strong relationships between students, landlords, 
                and universities to create better housing solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-lg p-8 text-white">
            <h3 className="text-3xl font-bold mb-8 text-center">Our Impact</h3>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <div className="text-blue-100">Students Helped</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-blue-100">Verified Properties</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-blue-100">Partner Universities</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">4.8</div>
                <div className="text-blue-100 flex items-center justify-center gap-1">
                  <FaStar className="text-yellow-300" />
                  Average Rating
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">Our Team</h3>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              CampusRooms is powered by a dedicated team of professionals passionate about 
              improving student housing experiences.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="bg-gray-200 dark:bg-gray-700 w-24 h-24 rounded-full mx-auto mb-4"></div>
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Technology Team</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Building innovative solutions to make housing search seamless and efficient.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gray-200 dark:bg-gray-700 w-24 h-24 rounded-full mx-auto mb-4"></div>
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Support Team</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Providing exceptional customer service and support to students and landlords.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Ready to Find Your Perfect Campus Home?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Join thousands of students who have found their ideal accommodation through CampusRooms.
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition shadow-lg"
            >
              Start Your Search
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About; 