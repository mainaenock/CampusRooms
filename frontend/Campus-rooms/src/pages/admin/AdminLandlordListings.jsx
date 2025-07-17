import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ListingCard from '../../components/ListingCard';

const AdminLandlordListings = () => {
  const { landlordId } = useParams();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:3000/api/admin/landlord-listings/${landlordId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setListings(res.data);
        if (res.data.length > 0 && res.data[0].landlord) {
          setLandlord(res.data[0].landlord);
        } else {
          setLandlord(null);
        }
      } catch (err) {
        setListings([]);
        setLandlord(null);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [landlordId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      <div className="max-w-6xl mx-auto w-full pt-24 pb-10 px-2 sm:px-4">
        <button
          className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          onClick={() => navigate(-1)}
        >
          &larr; Back
        </button>
        <h1 className="text-3xl font-extrabold text-blue-800 mb-4 text-center drop-shadow-lg animate-fade-in">
          Landlord's Listings
        </h1>
        {landlord && (
          <div className="mb-6 text-center">
            <div className="text-xl font-bold text-blue-700">{landlord.firstName} {landlord.lastName}</div>
            <div className="text-gray-600">{landlord.email}</div>
          </div>
        )}
        {loading ? (
          <div className="text-center text-blue-700">Loading...</div>
        ) : listings.length === 0 ? (
          <div className="text-center text-gray-500">This landlord has no listings.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-fade-in delay-200">
            {listings.map(listing => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLandlordListings; 