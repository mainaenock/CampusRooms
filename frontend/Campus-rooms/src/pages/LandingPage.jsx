

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandingHeader from './components/LandingHeader';
import { Link } from 'react-router-dom';
import ListingCardLanding from '../components/ListingCardLanding';

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
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({ university: '', minRent: '', maxRent: '', amenities: [] });
  const [uniInput, setUniInput] = useState('');
  const [showUniSuggestions, setShowUniSuggestions] = useState(false);
  useEffect(() => {
    const params = {};
    if (filters.university) params.university = filters.university;
    if (filters.minRent) params.minRent = filters.minRent;
    if (filters.maxRent) params.maxRent = filters.maxRent;
    if (filters.amenities.length) params.amenities = filters.amenities.join(',');
    axios.get('http://localhost:3000/api/listings?featured=true', { params })
      .then(res => setListings(res.data.slice(0, 8)))
      .catch(() => setListings([]));
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
      <main className="flex-1 w-full px-1 sm:px-2 md:px-0 pt-8 md:pt-12">
        <div className="max-w-6xl mx-auto mt-6 md:mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-4 sm:mb-6 animate-fade-in delay-400 flex items-center gap-2">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10.75V19a2 2 0 002 2h14a2 2 0 002-2v-8.25M3 10.75L12 4l9 6.75M3 10.75l9 6.75 9-6.75" /></svg>
            Popular homes near campus
          </h2>
          <div className="flex gap-4 sm:gap-8 overflow-x-auto pb-4 snap-x">
            {listings.length === 0 ? (
              <div className="text-gray-500 text-center py-8 animate-fade-in delay-500">No featured listings yet.</div>
            ) : listings.map((l, i) => (
              <div key={l._id || i} className="snap-center animate-fade-in delay-500 min-w-[260px] sm:min-w-[320px] max-w-xs">
                <ListingCardLanding listing={l} />
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="w-full py-6 sm:py-8 text-center text-gray-400 text-sm sm:text-md border-t mt-10 sm:mt-16 bg-gradient-to-r from-blue-50 via-red-50 to-green-50 animate-fade-in delay-700">
        &copy; {new Date().getFullYear()} <span className="font-bold bg-gradient-to-r from-blue-700 via-red-900 to-green-800 bg-clip-text text-transparent">CampusRoomsKe</span>. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
