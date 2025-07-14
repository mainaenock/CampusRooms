
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const amenitiesList = ['Water', 'Electricity', 'WiFi', 'Parking', 'CCTV', 'Furnished'];

const NewListing = () => {
  const [form, setForm] = useState({
    name: '',
    university: '',
    distance: '',
    rent: '',
    depositRequired: false,
    amenities: [],
    roomType: ''
  });
  const [images, setImages] = useState([]); // File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Data URLs

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

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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
      toast.success('Listing created! Pay Ksh 100 to publish.');
      setForm({ name: '', university: '', distance: '', rent: '', depositRequired: false, amenities: [] });
      setImages([]);
      setImagePreviews([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 w-full max-w-lg space-y-4">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">Add New Apartment</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">Apartment Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="mt-1 w-full border rounded px-3 py-2" />
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
              <label key={a} className="flex items-center gap-1 text-xs">
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
          <label className="block text-sm font-medium text-gray-700">Apartment Images (max 5)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mt-1"
          />
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
          {loading ? 'Submitting...' : 'Add Listing'}
        </button>
      </form>
    </div>
  );
};

export default NewListing;
