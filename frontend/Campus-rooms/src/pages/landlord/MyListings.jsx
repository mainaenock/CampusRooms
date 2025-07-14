import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListingCard from '../../components/ListingCard';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyListings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/listings/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListings(res.data);
    } catch (err) {
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">My Listings</h1>
        {loading ? (
          <div className="text-center text-blue-700">Loading...</div>
        ) : listings.length === 0 ? (
          <div className="text-center text-gray-500">You have no listings yet.</div>
        ) : (
          <div className="grid gap-6">
            {listings.map(listing => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;
