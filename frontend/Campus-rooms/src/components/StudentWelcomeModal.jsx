import React from 'react';
import { FaFlag, FaUsers, FaHeart, FaTimes } from 'react-icons/fa';

const StudentWelcomeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaUsers className="text-blue-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome to CampusRooms! 🏠</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold p-1"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-6">
          {/* Main Message */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-lg text-gray-700 leading-relaxed">
              <strong>Finding a house near campus can be a real hustle!</strong> We know how challenging it is for students to find affordable, available accommodation.
            </p>
          </div>

          {/* Problem Statement */}
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
            <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
              <FaFlag className="text-red-600" />
              Help Your Fellow Students!
            </h3>
            <p className="text-gray-700">
              Many students waste time and money visiting properties that are already occupied or have issues. 
              <strong> You can help change this!</strong>
            </p>
          </div>

          {/* How to Help */}
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-green-800 mb-3">How You Can Help:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-green-200 p-2 rounded-full mt-1">
                  <FaFlag className="text-green-600 text-sm" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Flag Occupied Properties</p>
                  <p className="text-sm text-gray-600">If you find out a property is already occupied, flag it immediately</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-200 p-2 rounded-full mt-1">
                  <FaFlag className="text-green-600 text-sm" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Report Misleading Information</p>
                  <p className="text-sm text-gray-600">Flag properties with fake photos, wrong prices, or false amenities</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-200 p-2 rounded-full mt-1">
                  <FaFlag className="text-green-600 text-sm" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Report Fake Listings</p>
                  <p className="text-sm text-gray-600">Help remove scam listings that waste everyone's time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Impact */}
          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-purple-800 mb-2 flex items-center gap-2">
              <FaHeart className="text-purple-600" />
              Your Impact
            </h3>
            <p className="text-gray-700">
              Every flag you submit helps <strong>hundreds of other students</strong> avoid wasting time on unavailable properties. 
              Together, we can make house hunting easier for everyone!
            </p>
          </div>

          {/* How to Flag */}
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">How to Flag a Property:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Visit any property's details page</li>
              <li>Click the <strong>"Flag Property"</strong> button (red button)</li>
              <li>Select a reason (occupied, misleading info, etc.)</li>
              <li>Add any additional details if needed</li>
              <li>Submit the flag</li>
            </ol>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              Got it! Let's help each other! 🤝
            </button>
            <p className="text-sm text-gray-500 mt-2">
              You can always access this information from your profile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentWelcomeModal; 