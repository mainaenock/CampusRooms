import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LandingHeader from './components/LandingHeader';
import ChatRoom from './components/ChatRoom';
import FlagModal from '../components/FlagModal';
import axios from 'axios';

const ListingDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [showContact, setShowContact] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [imgModal, setImgModal] = useState({ open: false, idx: 0 });
  const [chatOpen, setChatOpen] = useState(false);
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [hasFlagged, setHasFlagged] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  if (!state || !state.listing) {
    return <div className="p-8 text-center">No listing found.</div>;
  }
  const listing = state.listing;

  // Check if user has already flagged this listing
  const checkFlagStatus = async () => {
    if (user && user.role === 'student') {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/flags/check/${listing._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHasFlagged(response.data.hasFlagged);
      } catch (error) {
        console.error('Error checking flag status:', error);
        if (error.response?.status === 401) {
          // Token expired, redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
    }
  };

  useEffect(() => {
    checkFlagStatus();
  }, [listing._id, user]);

  const handleShowContact = () => {
    if (!user) {
      setModalOpen(true);
    } else {
      setShowContact(true);
    }
  };

  const handleLoginRedirect = () => {
    setModalOpen(false);
    navigate('/login');
  };

  return (
    <>
      <LandingHeader />
      <div className={`min-h-screen bg-blue-50 py-8 px-4 flex justify-center pt-24${modalOpen ? ' backdrop-blur-sm' : ''}`}> 
        <div className="max-w-4xl w-full bg-white rounded-lg shadow p-6">
          {/* Image grid like Airbnb */}
          {listing.images && listing.images.length > 0 && (
            <div className="mb-6 grid grid-cols-3 grid-rows-2 gap-2 relative" style={{ minHeight: '320px' }}>
              {/* Main image */}
              <div className="row-span-2 col-span-2">
                <img
                  src={listing.images[0].startsWith('http') ? listing.images[0] : `http://localhost:3000${listing.images[0]}`}
                  alt={listing.name + ' 1'}
                  className="w-full h-full object-cover rounded-l-lg rounded-tr-none rounded-br-none cursor-pointer"
                  style={{ minHeight: '320px', maxHeight: '420px' }}
                  onClick={() => setImgModal({ open: true, idx: 0 })}
                />
              </div>
              {/* Up to 4 more images */}
              {listing.images.slice(1, 5).map((img, idx) => (
                <div key={idx} className={`overflow-hidden ${idx === 1 ? 'rounded-tr-lg' : ''} ${idx === 3 ? 'rounded-br-lg' : ''}`}>
                  <img
                    src={img.startsWith('http') ? img : `http://localhost:3000${img}`}
                    alt={listing.name + ' ' + (idx + 2)}
                    className="w-full h-full object-cover cursor-pointer"
                    style={{ minHeight: '155px', maxHeight: '210px' }}
                    onClick={() => setImgModal({ open: true, idx: idx + 1 })}
                  />
                </div>
              ))}
              {/* Show all photos button overlay if more than 5 images */}
              {listing.images.length > 5 && (
                <button
                  className="absolute bottom-4 right-4 bg-white bg-opacity-90 px-4 py-2 rounded shadow text-gray-800 font-semibold flex items-center gap-2 hover:bg-gray-100 z-10"
                  onClick={() => setImgModal({ open: true, idx: 0 })}
                  title="Show all photos"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v9.75M3 16.5A2.25 2.25 0 005.25 18.75h13.5A2.25 2.25 0 0021 16.5M3 16.5v-1.5a.75.75 0 01.75-.75h16.5a.75.75 0 01.75.75v1.5" />
                  </svg>
                  Show all photos
                </button>
              )}
            </div>
          )}
      {/* Image modal */}
      {imgModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <button
            className="absolute top-4 right-8 text-white text-3xl font-bold z-60 hover:text-gray-300"
            onClick={() => setImgModal({ open: false, idx: 0 })}
            aria-label="Close"
          >
            &times;
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl font-bold z-60 px-2 hover:text-gray-300"
            onClick={() => setImgModal(m => ({ open: true, idx: (m.idx - 1 + listing.images.length) % listing.images.length }))}
            aria-label="Previous"
            style={{userSelect:'none'}}
          >
            &#8592;
          </button>
          <img
            src={listing.images[imgModal.idx].startsWith('http') ? listing.images[imgModal.idx] : `http://localhost:3000${listing.images[imgModal.idx]}`}
            alt={listing.name + ' ' + (imgModal.idx + 1)}
            className="max-h-[80vh] max-w-[90vw] rounded shadow-lg border-4 border-white"
            style={{background:'#fff'}}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl font-bold z-60 px-2 hover:text-gray-300"
            onClick={() => setImgModal(m => ({ open: true, idx: (m.idx + 1) % listing.images.length }))}
            aria-label="Next"
            style={{userSelect:'none'}}
          >
            &#8594;
          </button>
        </div>
      )}
        <h2 className="text-2xl font-bold text-blue-800 mb-2">{listing.name}</h2>
        <div className="text-gray-700 mb-2">{listing.university} &bull; {listing.distance}m from campus gate</div>
        <div className="text-lg font-semibold text-green-700 mb-2">KSh {listing.rent} per month</div>
        <div className="mb-2"><span className="font-semibold">Room Type:</span> {listing.roomType}</div>
        <div className="mb-2"><span className="font-semibold">Deposit Required:</span> {listing.depositRequired ? 'Yes' : 'No'}</div>
        <div className="mb-2"><span className="font-semibold">Amenities:</span> {listing.amenities && listing.amenities.length > 0 ? listing.amenities.join(', ') : 'None'}</div>
        <div className="mb-2"><span className="font-semibold">Status:</span> {listing.occupied ? 'Occupied' : 'Empty'}</div>
        <div className="mb-2 text-xs text-gray-500">Listed by: {listing.landlord?.firstName} {listing.landlord?.lastName}</div>
        <button
          className="mt-4 px-6 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
          onClick={handleShowContact}
        >
          {showContact ? listing.phoneNumber : 'Show Contact'}
        </button>

        {/* Chat with Landlord button for students (not landlord) */}
        {user && user.role === 'student' && user._id !== listing.landlord?._id && (
          <button
            className="mt-4 ml-4 px-6 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700 transition"
            onClick={() => setChatOpen(true)}
          >
            Chat with Landlord
          </button>
        )}

        {/* Flag Property button for students */}
        {user && user.role === 'student' && (
          <button
            className={`mt-4 ml-4 px-6 py-2 rounded font-bold transition ${
              hasFlagged 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
            onClick={() => !hasFlagged && setFlagModalOpen(true)}
            disabled={hasFlagged}
            title={hasFlagged ? 'You have already flagged this property' : 'Flag this property if it is occupied or has issues'}
          >
            {hasFlagged ? 'Already Flagged' : 'Flag Property'}
          </button>
        )}

        {chatOpen && (
          <ChatRoom
            listingId={listing._id}
            userId={user && (user._id || user.id) ? (user._id || user.id) : ''}
            receiverId={listing.landlord?._id}
            userName={user?.firstName || 'You'}
            receiverName={listing.landlord?.firstName || 'Landlord'}
            onClose={() => setChatOpen(false)}
          />
        )}
        {modalOpen && (
          <>
            {/* Modal overlay with blur */}
            <div className="fixed inset-0 z-40 backdrop-blur-sm flex items-center justify-center">
              {/* Transparent overlay to catch clicks */}
              <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
              <div className="relative bg-white rounded-lg shadow p-6 max-w-sm w-full text-center z-50">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <div className="text-lg font-bold mb-2">Login Required</div>
                <div className="mb-4">To view the contact, please log in first.</div>
                <button
                  className="px-6 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
                  onClick={handleLoginRedirect}
                >
                  OK
                </button>
              </div>
            </div>
          </>
        )}

        {/* Flag Modal */}
        <FlagModal
          isOpen={flagModalOpen}
          onClose={() => {
            setFlagModalOpen(false);
          }}
          onFlagSuccess={() => {
            setHasFlagged(true);
            checkFlagStatus(); // Refresh the flag status
          }}
          listingId={listing._id}
          listingName={listing.name}
        />
      </div>
      </div>
    </>
  );
};

export default ListingDetails;
