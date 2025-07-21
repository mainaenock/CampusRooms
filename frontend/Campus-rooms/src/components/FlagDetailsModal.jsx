import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFlag, FaTimes, FaCheck, FaEye } from 'react-icons/fa';
import API_BASE_URL from '../config/api';

const FlagDetailsModal = ({ isOpen, onClose, listingId, listingName, onFlagUpdate }) => {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && listingId) {
      fetchFlags();
    }
  }, [isOpen, listingId]);

  const fetchFlags = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/flags/listing/${listingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFlags(response.data);
    } catch (error) {
      console.error('Error fetching flags:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFlagStatus = async (flagId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/flags/${flagId}/status`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setFlags(prevFlags => 
        prevFlags.map(flag => 
          flag._id === flagId ? { ...flag, status: newStatus } : flag
        )
      );

      // Show success message
      const statusText = newStatus === 'resolved' ? 'resolved' : newStatus;
      alert(`Flag marked as ${statusText} successfully!`);

      // Check if all flags are now resolved
      const updatedFlags = flags.map(flag => 
        flag._id === flagId ? { ...flag, status: newStatus } : flag
      );
      const allResolved = updatedFlags.every(flag => flag.status === 'resolved');
      
      if (allResolved && newStatus === 'resolved') {
        alert('All flags for this listing have been resolved. The listing has been unflagged!');
        // Call parent callback to refresh flagged listings
        if (onFlagUpdate) {
          onFlagUpdate();
        }
      }
    } catch (error) {
      console.error('Error updating flag status:', error);
      alert('Failed to update flag status.');
    }
  };

  const unflagListing = async () => {
    if (!window.confirm('Are you sure you want to unflag this listing? This will remove all flags and make the listing available to students again.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/flags/unflag/${listingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Listing unflagged successfully!');
      
      // Call parent callback to refresh flagged listings
      if (onFlagUpdate) {
        onFlagUpdate();
      }
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error unflagging listing:', error);
      const message = error.response?.data?.message || 'Failed to unflag listing.';
      alert(message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReasonText = (reason) => {
    switch (reason) {
      case 'occupied': return 'Property is occupied';
      case 'misleading_info': return 'Misleading information';
      case 'fake_listing': return 'Fake listing';
      case 'other': return 'Other';
      default: return reason;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaFlag className="text-red-600" />
            Flag Details for {listingName}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={unflagListing}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
              title="Unflag this listing completely"
            >
              Unflag Listing
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading flags...</div>
        ) : flags.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No flags found for this listing.</div>
        ) : (
          <div className="space-y-4">
            {flags.map((flag) => (
              <div key={flag._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-gray-800">
                      {flag.flaggedBy?.firstName} {flag.flaggedBy?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {flag.flaggedBy?.email} • {new Date(flag.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(flag.status)}`}>
                      {flag.status}
                    </span>
                    <div className="flex gap-1">
                      {flag.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateFlagStatus(flag._id, 'reviewed')}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Mark as reviewed"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => updateFlagStatus(flag._id, 'resolved')}
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Mark as resolved"
                          >
                            <FaCheck />
                          </button>
                        </>
                      )}
                      {flag.status === 'reviewed' && (
                        <button
                          onClick={() => updateFlagStatus(flag._id, 'resolved')}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Mark as resolved"
                        >
                          <FaCheck />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-700">Reason:</span>
                  <span className="ml-2 text-sm text-gray-600">{getReasonText(flag.reason)}</span>
                </div>
                
                {flag.description && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Description:</span>
                    <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {flag.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlagDetailsModal; 