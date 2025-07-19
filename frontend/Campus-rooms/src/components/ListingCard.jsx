import React from 'react';
import { useNavigate } from 'react-router-dom';
import noImage from '../assets/No_Image_Available.jpg';
import { getImageUrl } from '../utils/imageUtils.js';

const ListingCard = ({ listing, showEdit }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 border hover:shadow-lg transition h-full min-h-[420px] max-h-[480px]">
      {listing.images && listing.images.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto mb-2">
          {listing.images.map((imageId, idx) => {
            const imageUrl = getImageUrl(imageId);
            return (
              <img key={idx} src={imageUrl} alt="Apartment" className="h-28 w-40 object-cover rounded border" />
            );
          })}
        </div>
      ) : (
        <div className="flex justify-center items-center mb-2">
          <img src={noImage} alt="No Apartment" className="h-28 w-40 object-cover rounded border" />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-blue-800">{listing.name}</h3>
          {listing.roomType && (
            <div className="text-xs text-gray-500 font-semibold mt-1">{listing.roomType.replace(/\b\w/g, l => l.toUpperCase())}</div>
          )}
        </div>
        {listing.isFeatured && (
          <span className="bg-yellow-300 text-yellow-900 px-2 py-1 rounded text-xs font-bold ml-2">Featured</span>
        )}
      </div>
      <div className="text-gray-600 text-sm">Near <span className="font-semibold">{listing.university}</span> &bull; {listing.distance}m from gate</div>
      <div className="text-lg font-semibold text-green-700">Ksh {listing.rent}{listing.depositRequired && <span className="text-xs text-gray-500 ml-2">+ Deposit</span>}</div>
      <div className="flex flex-wrap gap-2 mt-1">
        {listing.amenities.map((a, i) => (
          <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{a}</span>
        ))}
      </div>
      <div className="text-xs text-gray-400 mt-2">Listed by: {listing.landlord?.firstName} {listing.landlord?.lastName}</div>
      {showEdit && (
        <button
          className="mt-2 px-4 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition self-end"
          onClick={() => navigate(`/landlord/edit-listing/${listing._id}`)}
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default ListingCard;
