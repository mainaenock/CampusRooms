import React from 'react';
import { useNavigate } from 'react-router-dom';

const ListingCardLanding = ({ listing }) => {
  const navigate = useNavigate();
  return (
    <div
      className="min-w-[260px] max-w-xs bg-white rounded-xl shadow hover:shadow-lg transition flex-shrink-0 cursor-pointer"
      onClick={() => navigate('/listing-details', { state: { listing } })}
    >
      <div className="relative">
        <img src={listing.images && listing.images[0] ? (listing.images[0].startsWith('http') ? listing.images[0] : `http://localhost:3000${listing.images[0]}`) : 'https://via.placeholder.com/300x180?text=No+Image'} alt={listing.name} className="w-full h-44 object-cover rounded-t-xl" />
        {listing.isFeatured && <span className="absolute top-2 left-2 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded shadow">Featured</span>}
        <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100"><span>&#9825;</span></button>
      </div>
      <div className="p-3">
        <div className="font-semibold text-gray-900 text-base mb-1">{listing.name}</div>
        <div className="text-gray-700 text-sm mb-1">Ksh {listing.rent} per month</div>
        <div className="text-s text-gray-700 mb-1 font-semibold">{listing.university}</div>
        <div className="text-xs text-gray-500 mb-1">{listing.distance}m from campus gate</div>
        <div className="flex flex-wrap gap-1 mt-2">
          {Array.isArray(listing.amenities) && listing.amenities.length > 0 ? (
            listing.amenities.map((a, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{a}</span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">No amenities listed</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCardLanding;
