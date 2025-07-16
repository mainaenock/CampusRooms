import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListingCard from '../components/ListingCard';
import Header from './components/header';

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
  // ...add more as needed
];

const amenitiesList = ['Water', 'Electricity', 'WiFi', 'Parking', 'CCTV', 'Furnished'];

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({ university: '', minRent: '', maxRent: '', amenities: [] });
  const [loading, setLoading] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.university) params.university = filters.university;
      if (filters.minRent) params.minRent = filters.minRent;
      if (filters.maxRent) params.maxRent = filters.maxRent;
      if (filters.amenities.length) params.amenities = filters.amenities.join(',');
      const res = await axios.get('http://localhost:3000/api/listings', { params });
      setListings(res.data);
    } catch (err) {
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line
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

  return (
    <>
      <Header />
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Find Student Apartments</h1>
        <div className="bg-white rounded-lg shadow p-4 mb-8 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">University</label>
            <select
              className="mt-1 border rounded px-3 py-2"
              value={filters.university}
              onChange={e => setFilters(f => ({ ...f, university: e.target.value }))}
            >
              <option value="">All</option>
              {universities.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Rent</label>
            <input
              type="number"
              className="mt-1 border rounded px-3 py-2"
              value={filters.minRent}
              onChange={e => setFilters(f => ({ ...f, minRent: e.target.value }))}
              placeholder="e.g. 5000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Rent</label>
            <input
              type="number"
              className="mt-1 border rounded px-3 py-2"
              value={filters.maxRent}
              onChange={e => setFilters(f => ({ ...f, maxRent: e.target.value }))}
              placeholder="e.g. 15000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amenities</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {amenitiesList.map(a => (
                <label key={a} className="flex items-center gap-1 text-xs">
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
        {loading ? (
          <div className="text-center text-blue-700">Loading listings...</div>
        ) : listings.length === 0 ? (
          <div className="text-center text-gray-500">No listings found.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {listings.map(listing => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Listings;
