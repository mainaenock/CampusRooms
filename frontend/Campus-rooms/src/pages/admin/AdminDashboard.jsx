import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaUserTie, FaUserGraduate, FaHome, FaMoneyBillWave, FaStar } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentListings, setRecentListings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const [statsRes, listingsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:3000/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:3000/api/admin/recent-listings', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:3000/api/admin/recent-users', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setStats(statsRes.data);
        setRecentListings(listingsRes.data);
        setRecentUsers(usersRes.data);
      } catch (err) {
        setStats(null);
        setRecentListings([]);
        setRecentUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-12">Loading admin dashboard...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-10 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-8 text-center drop-shadow-lg animate-fade-in">
          <span className="bg-gradient-to-r from-blue-700 via-red-900 to-green-800 bg-clip-text text-transparent">Admin Dashboard</span>
        </h1>
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10 animate-fade-in delay-100">
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border-t-4 border-blue-700">
              <FaUsers className="text-3xl text-blue-700 mb-2" />
              <div className="text-3xl font-extrabold text-blue-700">{stats.totalUsers}</div>
              <div className="text-gray-600 font-semibold mt-1">Total Users</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border-t-4 border-blue-500">
              <FaUserTie className="text-3xl text-blue-600 mb-2" />
              <div className="text-3xl font-extrabold text-blue-600">{stats.totalLandlords}</div>
              <div className="text-gray-600 font-semibold mt-1">Landlords</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border-t-4 border-blue-400">
              <FaUserGraduate className="text-3xl text-blue-400 mb-2" />
              <div className="text-3xl font-extrabold text-blue-400">{stats.totalStudents}</div>
              <div className="text-gray-600 font-semibold mt-1">Students</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border-t-4 border-green-700">
              <FaHome className="text-3xl text-green-700 mb-2" />
              <div className="text-3xl font-extrabold text-green-700">{stats.totalListings}</div>
              <div className="text-gray-600 font-semibold mt-1">Total Listings</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border-t-4 border-green-500">
              <FaMoneyBillWave className="text-3xl text-green-600 mb-2" />
              <div className="text-3xl font-extrabold text-green-600">{stats.paidListings}</div>
              <div className="text-gray-600 font-semibold mt-1">Paid Listings</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border-t-4 border-yellow-500">
              <FaStar className="text-3xl text-yellow-500 mb-2" />
              <div className="text-3xl font-extrabold text-yellow-500">{stats.featuredListings}</div>
              <div className="text-gray-600 font-semibold mt-1">Featured Listings</div>
            </div>
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-10 animate-fade-in delay-200">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2"><FaHome className="text-green-700" /> Recent Listings</h2>
            <ul className="bg-white rounded-xl shadow-lg p-4 divide-y border border-blue-100">
              {recentListings.length === 0 ? <li className="text-gray-500">No recent listings.</li> : recentListings.map(l => (
                <li key={l._id} className="py-3 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-blue-700 text-lg">{l.name}</div>
                    {l.isFeatured ? (
                      <span className="ml-2 px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-bold flex items-center gap-1"><FaStar /> Featured</span>
                    ) : (
                      <button
                        className="ml-2 px-3 py-1 rounded bg-yellow-500 text-white text-xs font-bold hover:bg-yellow-600 transition"
                        onClick={async () => {
                          const token = localStorage.getItem('token');
                          try {
                            await axios.post(`http://localhost:3000/api/admin/feature-listing/${l._id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
                            setRecentListings(listings => listings.map(item => item._id === l._id ? { ...item, isFeatured: true } : item));
                            setStats(s => s ? { ...s, featuredListings: s.featuredListings + 1 } : s);
                          } catch (err) {
                            alert('Failed to feature listing.');
                          }
                        }}
                      >
                        Feature
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">{l.university} &bull; {l.rent} Ksh &bull; {l.landlord?.firstName} {l.landlord?.lastName}</div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2"><FaUsers className="text-blue-700" /> Recent Users</h2>
            <ul className="bg-white rounded-xl shadow-lg p-4 divide-y border border-blue-100">
              {recentUsers.length === 0 ? <li className="text-gray-500">No recent users.</li> : recentUsers.map(u => (
                <li key={u._id} className="py-3">
                  <div className="font-bold text-blue-700 text-lg">{u.firstName} {u.lastName}</div>
                  <div className="text-xs text-gray-500">{u.email} &bull; {u.role}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
