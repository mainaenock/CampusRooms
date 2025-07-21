import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    rent: '',
    roomType: '',
    university: '',
    amenities: [],
    images: [],
    phoneNumber: '',
    depositRequired: false,
    isFeatured: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch listing details
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/api/listings/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setForm(res.data))
      .catch(() => navigate('/landlord/listings'));
  }, [id, navigate]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_BASE_URL}/api/listings/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/landlord/listings');
    } catch {
      alert('Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        type="button"
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Listing</h2>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="mb-2 w-full p-2 border rounded" />
        <input name="rent" value={form.rent} onChange={handleChange} placeholder="Rent" className="mb-2 w-full p-2 border rounded" />
        <input name="roomType" value={form.roomType} onChange={handleChange} placeholder="Room Type" className="mb-2 w-full p-2 border rounded" />
        <input name="university" value={form.university} onChange={handleChange} placeholder="University" className="mb-2 w-full p-2 border rounded" />
        <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="mb-2 w-full p-2 border rounded" />
        <div className="mb-2">
          <label className="block font-semibold mb-1">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {['Water', 'Electricity', 'WiFi', 'Parking', 'CCTV', 'Furnished'].map(a => (
              <label key={a} className="flex items-center gap-1 text-xs bg-blue-50 px-2 py-1 rounded shadow-sm cursor-pointer hover:bg-blue-100">
                <input
                  type="checkbox"
                  checked={form.amenities.includes(a)}
                  onChange={() => {
                    setForm(f => ({
                      ...f,
                      amenities: f.amenities.includes(a)
                        ? f.amenities.filter(am => am !== a)
                        : [...f.amenities, a]
                    }));
                  }}
                />
                {a}
              </label>
            ))}
          </div>
        </div>
        <label className="block mb-2">
          <input type="checkbox" name="depositRequired" checked={form.depositRequired} onChange={handleChange} /> Deposit Required
        </label>
        <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded mt-4">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditListing;
