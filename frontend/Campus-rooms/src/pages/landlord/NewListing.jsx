

import React, { useState } from 'react';
import MpesaListingPaymentModal from './MpesaListingPaymentModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import LandingHeader from '../components/LandingHeader';
import MapPicker from './MapPicker';

const amenitiesList = ['Water', 'Electricity', 'WiFi', 'Parking', 'CCTV', 'Furnished'];

const NewListing = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    university: '',
    distance: '',
    rent: '',
    depositRequired: false,
    amenities: [],
    roomType: '',
    phoneNumber: '',
    location: null // [lat, lng]
  });
  const [mapPosition, setMapPosition] = useState(null);
  const [images, setImages] = useState([]); // File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Data URLs
  const [institutionCoords, setInstitutionCoords] = useState(null);
  const [institutionSearchLoading, setInstitutionSearchLoading] = useState(false);
  const [institutionSearchError, setInstitutionSearchError] = useState(null);
  const [distanceToInstitution, setDistanceToInstitution] = useState(null);
  // Geocode institution name using OpenStreetMap Nominatim
  React.useEffect(() => {
    if (!form.university || form.university.length < 3) {
      setInstitutionCoords(null);
      setInstitutionSearchError(null);
      return;
    }
    setInstitutionSearchLoading(true);
    setInstitutionSearchError(null);
    const controller = new AbortController();
    fetch(`/api/settings/geocode?query=${encodeURIComponent(form.university)}`, {
      signal: controller.signal
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setInstitutionCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          setInstitutionCoords(null);
          setInstitutionSearchError('Institution not found');
        }
      })
      .catch(() => {
        setInstitutionCoords(null);
        setInstitutionSearchError('Institution search failed');
      })
      .finally(() => setInstitutionSearchLoading(false));
    return () => controller.abort();
  }, [form.university]);

  // Haversine formula for distance in meters
  function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    function toRad(x) { return x * Math.PI / 180; }
    const R = 6371000; // Radius of the earth in m
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Calculate distance when both positions are set
  React.useEffect(() => {
    if (mapPosition && institutionCoords) {
      const d = getDistanceFromLatLonInMeters(
        mapPosition[0], mapPosition[1],
        institutionCoords[0], institutionCoords[1]
      );
      setDistanceToInstitution(Math.round(d));
      setForm(f => ({ ...f, distance: Math.round(d) }));
    } else {
      setDistanceToInstitution(null);
    }
  }, [mapPosition, institutionCoords]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleRemoveImage = (idx) => {
    setImages(imgs => imgs.filter((_, i) => i !== idx));
    setImagePreviews(previews => previews.filter((_, i) => i !== idx));
  };
  const [loading, setLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null); // Store form data for post-payment submission
  const [requirePayment, setRequirePayment] = useState(true);
  React.useEffect(() => {
    // Fetch payment requirement status
    const fetchPaymentRequirement = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/settings/payment-requirement');
        setRequirePayment(res.data.requirePaymentForListing);
      } catch {
        setRequirePayment(true); // Default to true if error
      }
    };
    fetchPaymentRequirement();
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Update form location when map marker changes
  React.useEffect(() => {
    setForm(f => ({ ...f, location: mapPosition }));
  }, [mapPosition]);

  const handleAmenityChange = amenity => {
    setForm(f => {
      const exists = f.amenities.includes(amenity);
      return {
        ...f,
        amenities: exists ? f.amenities.filter(a => a !== amenity) : [...f.amenities, amenity]
      };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (requirePayment) {
      setPendingFormData({ ...form, images });
      setPaymentModalOpen(true);
    } else {
      // Directly create listing if payment is not required
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => formData.append(key, v));
          } else {
            formData.append(key, value);
          }
        });
        images.forEach(img => formData.append('images', img));
        await axios.post('http://localhost:3000/api/listings', formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Listing created and published!');
        setForm({ name: '', university: '', distance: '', rent: '', depositRequired: false, amenities: [], roomType: '', phoneNumber: '' });
        setImages([]);
        setImagePreviews([]);
        setTimeout(() => navigate('/landlord/listings'), 1000);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to create listing');
      } finally {
        setLoading(false);
      }
    }
  };

  // Called after payment is confirmed
  const handlePaymentSuccess = async () => {
    setPaymentModalOpen(false);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      Object.entries(pendingFormData).forEach(([key, value]) => {
        if (key === 'images') return; // We'll add images separately
        if (Array.isArray(value)) {
          value.forEach(v => formData.append(key, v));
        } else {
          formData.append(key, value);
        }
      });
      pendingFormData.images.forEach(img => formData.append('images', img));
      await axios.post('http://localhost:3000/api/listings', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Listing created and published!');
      setForm({ name: '', university: '', distance: '', rent: '', depositRequired: false, amenities: [], roomType: '', phoneNumber: '' });
      setImages([]);
      setImagePreviews([]);
      setTimeout(() => navigate('/landlord/listings'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
      setPendingFormData(null);
    }
  };

  // Geolocation for user's current position
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMapPosition([pos.coords.latitude, pos.coords.longitude]);
        setGeoLoading(false);
      },
      (err) => {
        setGeoError('Unable to retrieve your location.');
        setGeoLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      <LandingHeader />
      <main className="flex-1 flex flex-col items-center justify-center pt-28 pb-10 px-2 sm:px-4">
        <form onSubmit={handleSubmit} className="bg-white/90 rounded-xl shadow-2xl p-6 w-full max-w-lg space-y-4 border border-blue-100 backdrop-blur-md animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-800 mb-2 text-center drop-shadow-lg">Add New Apartment</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Apartment Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Room Type</label>
            <select
              name="roomType"
              value={form.roomType}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">Select type</option>
              <option value="bed-sitter">Bed-sitter</option>
              <option value="single room">Single Room</option>
              <option value="one bedroom">One Bedroom</option>
              <option value="two bedroom">2 Bedroom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">University/College/Polytechnic</label>
            <input name="university" value={form.university} onChange={handleChange} required className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pin House Location on Map</label>
            <button type="button" onClick={handleGetMyLocation} className="mb-2 px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition disabled:opacity-60" disabled={geoLoading}>
              {geoLoading ? 'Getting your location...' : 'Use My Current Location'}
            </button>
            {geoError && <div className="text-xs text-red-500 mb-1">{geoError}</div>}
            <MapPicker
              position={mapPosition}
              setPosition={setMapPosition}
              institutionCoords={institutionCoords}
            />
            {institutionSearchLoading && (
              <div className="text-xs text-gray-500 mt-1">Searching for institution location...</div>
            )}
            {mapPosition && (
              <div className="text-xs text-gray-500 mt-1">Latitude: {mapPosition[0].toFixed(6)}, Longitude: {mapPosition[1].toFixed(6)}</div>
            )}
            {institutionCoords && mapPosition && (
              <div className="text-xs text-blue-700 mt-1 font-semibold">
                Distance to institution: {distanceToInstitution} meters
              </div>
            )}
            {institutionSearchError && form.university && (
              <div className="text-xs text-red-500 mt-1">{institutionSearchError}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Distance from Gate (meters)</label>
            <input name="distance" type="number" value={form.distance} onChange={handleChange} required className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rent (Ksh)</label>
            <input name="rent" type="number" value={form.rent} onChange={handleChange} required className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div className="flex items-center gap-2">
            <input name="depositRequired" type="checkbox" checked={form.depositRequired} onChange={handleChange} />
            <label className="text-sm text-gray-700">Deposit Required</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amenities</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {amenitiesList.map(a => (
                <label key={a} className="flex items-center gap-1 text-xs bg-blue-50 px-2 py-1 rounded shadow-sm cursor-pointer hover:bg-blue-100">
                  <input
                    type="checkbox"
                    checked={form.amenities.includes(a)}
                    onChange={() => handleAmenityChange(a)}
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apartment Images (max 5)</label>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer inline-block px-4 py-2 bg-green-800 text-white font-semibold rounded shadow hover:bg-green-700 transition text-sm">
              Choose Images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <span className="text-xs text-gray-500">{images.length > 0 ? `${images.length} selected` : 'No file chosen'}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {imagePreviews.map((url, idx) => (
              <div key={idx} className="relative group">
                <img src={url} alt="Apartment" className="h-16 w-24 object-cover rounded border" />
                <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded opacity-80 group-hover:opacity-100">x</button>
              </div>
            ))}
          </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 px-4 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition">
            {loading ? 'Submitting...' : requirePayment ? 'Pay Ksh 149 to Submit' : 'Submit Listing'}
          </button>
        </form>
        {/* Move modal outside the form to avoid nested <form> error */}
        <MpesaListingPaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      </main>
    </div>
  );
};

export default NewListing;
