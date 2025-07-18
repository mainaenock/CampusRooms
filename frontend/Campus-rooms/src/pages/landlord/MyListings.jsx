import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LandingHeader from '../components/LandingHeader';
import ListingCard from '../../components/ListingCard';
import BackButton from '../../components/BackButton';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalListingId, setModalListingId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

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

  const handleOccupied = (listingId) => {
    setModalListingId(listingId);
    setShowModal(true);
  };

  const confirmOccupied = async () => {
    setModalLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/listings/${modalListingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListings(listings => listings.filter(l => l._id !== modalListingId));
      setShowModal(false);
      setModalListingId(null);
    } catch (err) {
      alert('Failed to delete listing.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      <LandingHeader />
      <main className="flex-1 w-full pt-28 pb-10 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <BackButton />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-8 text-center drop-shadow-lg animate-fade-in">My Listings</h1>
          {loading ? (
            <div className="text-center text-blue-700">Loading...</div>
          ) : listings.length === 0 ? (
            <div className="text-center text-gray-500">You have no listings yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-fade-in delay-200">
              {listings.map(listing => (
                <div key={listing._id} className="relative">
                  <ListingCard listing={listing} showEdit />
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${listing.occupied ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'}`}>
                      {listing.occupied ? 'Occupied' : 'Empty'}
                    </span>
                    <button
                      className="ml-2 px-3 py-1 rounded bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                      onClick={() => handleOccupied(listing._id)}
                    >
                      Mark as Occupied
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal for confirming occupied */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full animate-fade-in">
            <h3 className="text-lg font-bold text-red-700 mb-2">Mark as Occupied</h3>
            <p className="text-gray-700 mb-4">By clicking OK, this room will be deleted from the listings. Are you sure?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                onClick={() => { setShowModal(false); setModalListingId(null); }}
                disabled={modalLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white font-bold hover:bg-red-700"
                onClick={confirmOccupied}
                disabled={modalLoading}
              >
                {modalLoading ? 'Processing...' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;
