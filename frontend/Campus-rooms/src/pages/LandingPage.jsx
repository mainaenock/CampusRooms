

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandingHeader from './components/LandingHeader';
import { Link } from 'react-router-dom';
import ListingCardLanding from '../components/ListingCardLanding';
import API_BASE_URL from '../config/api';

const universities = [
  'University of Nairobi',
  'Kenyatta University',
  'Jomo Kenyatta University',
  'Moi University',
  'Egerton University',
  'Technical University of Kenya',
  'KCA University',
  'Strathmore University',
  'Kenyatta National Polytechnic',
  'Nairobi Technical Training Institute',
];
const amenitiesList = ['Water', 'Electricity', 'WiFi', 'Parking', 'CCTV', 'Furnished'];

const LandingPage = () => {
  const [allListings, setAllListings] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [unfeaturedListings, setUnfeaturedListings] = useState([]);
  const [filters, setFilters] = useState({ university: '', minRent: '', maxRent: '', amenities: [] });
  const [uniInput, setUniInput] = useState('');
  const [showUniSuggestions, setShowUniSuggestions] = useState(false);
  
  useEffect(() => {
    const params = {};
    if (filters.university) params.university = filters.university;
    if (filters.minRent) params.minRent = filters.minRent;
    if (filters.maxRent) params.maxRent = filters.maxRent;
    if (filters.amenities.length) params.amenities = filters.amenities.join(',');
    
    // Fetch all listings
    axios.get(`${API_BASE_URL}/api/listings`, { params })
      .then(res => {
        const listings = res.data;
        setAllListings(listings);
        
        // Separate featured and unfeatured listings
        const featured = listings.filter(l => l.isFeatured);
        const unfeatured = listings.filter(l => !l.isFeatured);
        
        setFeaturedListings(featured);
        setUnfeaturedListings(unfeatured);
      })
      .catch(() => {
        setAllListings([]);
        setFeaturedListings([]);
        setUnfeaturedListings([]);
      });
  }, [filters]);

  const handleAmenityChange = (amenity) => {
    setFilters((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity]
      };
    });
  };

  // Filtered university suggestions
  const filteredUniversities = universities.filter(u =>
    uniInput && u.toLowerCase().includes(uniInput.toLowerCase())
  ).slice(0, 5);

  // Get user and role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const isLandlord = user && user.role === 'landlord';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      <LandingHeader />
      {/* Hero Section */}
      <section className="relative pt-28 md:pt-32 pb-10 md:pb-16 px-2 sm:px-4 md:px-0 flex flex-col items-center text-center bg-gradient-to-br from-blue-100/80 to-green-100/60 w-full">
        {/* Landlord Add Listing Button - right aligned, not absolute */}
        {isLandlord && (
          <div className="w-full flex justify-end gap-3 mb-2 mr-8 animate-fade-in delay-200">
            <Link
              to="/landlord/listings"
              className="px-4 py-2 rounded border border-blue-700 text-blue-800 font-semibold bg-white shadow hover:bg-blue-50 transition text-sm md:text-base"
            >
              My Listings
            </Link>
            <Link
              to="/landlord/new-listing"
              className="px-4 py-2 rounded border border-green-700 text-green-800 font-semibold bg-white shadow hover:bg-green-50 transition text-sm md:text-base"
            >
              + Add New Listing
            </Link>
          </div>
        )}
        <div className="max-w-3xl mx-auto px-2 sm:px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg animate-fade-in">
            <span className="inline-block bg-gradient-to-r from-blue-700 via-red-900 to-green-800 bg-clip-text text-transparent animate-gradient-move">
              Campus
              <span className="text-red-900">Rooms</span>
              <span className="text-green-800">Ke</span>
            </span>
            <span className="block text-lg sm:text-2xl md:text-3xl font-bold text-blue-900 mt-2">Find your <span className="text-green-700">campus home</span></span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 animate-fade-in delay-100">Discover beautiful, affordable student rooms and apartments near your university. Search, filter, and book with ease!</p>
          
        </div>
        <div className="absolute left-0 right-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* Filter/Search Bar */}
      <section className="w-full flex justify-center -mt-10 md:-mt-12 z-10 animate-fade-in delay-300 px-2 sm:px-0">
        <div className="bg-white/90 justify-center rounded-xl shadow-xl flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 items-end px-3 sm:px-6 md:px-8 py-4 sm:py-6 border border-blue-100 backdrop-blur-md max-w-4xl w-full">
          <div className="w-full sm:w-auto relative">
            <label className="block text-xs font-semibold text-gray-600">University</label>
            <input
              type="text"
              className="mt-1 border rounded px-3 py-2 min-w-[160px]"
              value={uniInput}
              onChange={e => {
                setUniInput(e.target.value);
                setFilters(f => ({ ...f, university: e.target.value }));
                setShowUniSuggestions(true);
              }}
              onFocus={() => setShowUniSuggestions(true)}
              placeholder="Type institution name..."
              autoComplete="off"
            />
            {showUniSuggestions && filteredUniversities.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border border-blue-100 rounded shadow z-20 mt-1 max-h-40 overflow-y-auto animate-fade-in">
                {filteredUniversities.map(u => (
                  <li
                    key={u}
                    className="px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm"
                    onMouseDown={() => {
                      setUniInput(u);
                      setFilters(f => ({ ...f, university: u }));
                      setShowUniSuggestions(false);
                    }}
                  >
                    {u}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-gray-600">Min Rent</label>
            <input
              type="number"
              className="mt-1 border rounded px-3 py-2 min-w-[100px]"
              value={filters.minRent}
              onChange={e => setFilters(f => ({ ...f, minRent: e.target.value }))}
              placeholder="e.g. 5000"
            />
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-gray-600">Max Rent</label>
            <input
              type="number"
              className="mt-1 border rounded px-3 py-2 min-w-[100px]"
              value={filters.maxRent}
              onChange={e => setFilters(f => ({ ...f, maxRent: e.target.value }))}
              placeholder="e.g. 15000"
            />
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-gray-600">Amenities</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {amenitiesList.map(a => (
                <label key={a} className="flex items-center gap-1 text-xs bg-blue-50 px-2 py-1 rounded shadow-sm cursor-pointer hover:bg-blue-100">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(a)}
                    onChange={() => handleAmenityChange(a)}
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <main className="flex-1 w-full px-1 sm:px-2 md:px-0 md:pt-12">
        <div className="max-w-6xl mx-auto mt-6 md:mt-8">
          {/* Featured Listings */}
          {featuredListings.length > 0 && (
            <>
          <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-4 sm:mb-6 animate-fade-in delay-400 flex items-center gap-2">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87.18.88L12 17.77l-5.09 2.68.97-5.64L2 9.27l5.91-.61L12 2z" />
                </svg>
                Featured Properties
          </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
                {featuredListings.map((l, i) => (
                  <div key={l._id || i} className="animate-fade-in delay-500 w-full">
                <ListingCardLanding listing={l} />
              </div>
            ))}
          </div>
            </>
          )}

          {/* Unfeatured Listings */}
          {unfeaturedListings.length > 0 && (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-4 sm:mb-6 animate-fade-in delay-400 flex items-center gap-2">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10.75V19a2 2 0 002 2h14a2 2 0 002-2v-8.25M3 10.75L12 4l9 6.75M3 10.75l9 6.75 9-6.75" /></svg>
                All Properties
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {unfeaturedListings.map((l, i) => (
                  <div key={l._id || i} className="animate-fade-in delay-500 w-full">
                    <ListingCardLanding listing={l} />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* No Listings Message */}
          {allListings.length === 0 && (
            <div className="text-gray-500 text-center py-8 animate-fade-in delay-500">
              No listings found matching your criteria.
            </div>
          )}
        </div>
      </main>
      <footer className="w-full py-12 sm:py-16 border-t mt-10 sm:mt-16 bg-gradient-to-r from-blue-50 via-red-50 to-green-50 animate-fade-in delay-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <span className='font-bold text-xl text-gray-800'>Campus</span>
                <span className='font-bold text-xl text-red-900'>Rooms</span>
                <span className='font-bold text-xl text-green-800'>Ke</span>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                Your trusted platform for finding safe, affordable, and comfortable student accommodation 
                near universities across Kenya.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-600 transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-blue-600 transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-blue-600 transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-600 hover:text-blue-600 transition">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:support@campusrooms.co.ke" className="text-gray-600 hover:text-blue-600 transition">
                    Email Support
                  </a>
                </li>
                <li>
                  <a href="tel:+254113602658" className="text-gray-600 hover:text-blue-600 transition">
                    Call Us
                  </a>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-600 hover:text-blue-600 transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} <span className="font-bold bg-gradient-to-r from-blue-700 via-red-900 to-green-800 bg-clip-text text-transparent">CampusRoomsKe</span>. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/terms" className="text-gray-500 hover:text-blue-600 text-sm transition">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-gray-500 hover:text-blue-600 text-sm transition">
                Privacy Policy
              </Link>
              <a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
