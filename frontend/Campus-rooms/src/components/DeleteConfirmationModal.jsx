import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, listingName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center gap-3 mb-4">
          <FaExclamationTriangle className="text-red-600 text-2xl" />
          <h2 className="text-xl font-bold text-gray-800">Delete Flagged Property</h2>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-3">
            Are you sure you want to delete <span className="font-semibold text-red-600">"{listingName}"</span>?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">
              <strong>Warning:</strong> This action cannot be undone. {listingName === 'all flagged properties' 
                ? 'All flagged properties and their associated flags will be permanently deleted.' 
                : 'The property and all associated flags will be permanently deleted.'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Property'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 