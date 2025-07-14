import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Admin Dashboard</h1>
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded shadow p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{stats.totalUsers}</div>
              <div className="text-gray-600">Total Users</div>
            </div>
            <div className="bg-white rounded shadow p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{stats.totalLandlords}</div>
              <div className="text-gray-600">Landlords</div>
            </div>
            <div className="bg-white rounded shadow p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{stats.totalStudents}</div>
              <div className="text-gray-600">Students</div>
            </div>
            <div className="bg-white rounded shadow p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{stats.totalListings}</div>
              <div className="text-gray-600">Total Listings</div>
            </div>
            <div className="bg-white rounded shadow p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{stats.paidListings}</div>
              <div className="text-gray-600">Paid Listings</div>
            </div>
            <div className="bg-white rounded shadow p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.featuredListings}</div>
              <div className="text-gray-600">Featured Listings</div>
            </div>
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Recent Listings</h2>
            <ul className="bg-white rounded shadow p-4 divide-y">
              {recentListings.length === 0 ? <li className="text-gray-500">No recent listings.</li> : recentListings.map(l => (
                <li key={l._id} className="py-2">
                  <div className="font-bold text-blue-700">{l.name}</div>
                  <div className="text-xs text-gray-500">{l.university} &bull; {l.rent} Ksh &bull; {l.landlord?.firstName} {l.landlord?.lastName}</div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Recent Users</h2>
            <ul className="bg-white rounded shadow p-4 divide-y">
              {recentUsers.length === 0 ? <li className="text-gray-500">No recent users.</li> : recentUsers.map(u => (
                <li key={u._id} className="py-2">
                  <div className="font-bold text-blue-700">{u.firstName} {u.lastName}</div>
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
