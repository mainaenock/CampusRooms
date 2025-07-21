import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaUserTie, FaUserGraduate, FaHome, FaMoneyBillWave, FaStar, FaFlag, FaChartLine } from 'react-icons/fa';
import FlagDetailsModal from '../../components/FlagDetailsModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import BackButton from '../../components/BackButton';
import CacheManager from '../../components/CacheManager';
import { useNavigate } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import API_BASE_URL from '../../config/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentListings, setRecentListings] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [flaggedListings, setFlaggedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [deletingListing, setDeletingListing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [selectedCard, setSelectedCard] = useState('listings'); // NEW: Track selected card
  const [allUsers, setAllUsers] = useState([]); // NEW: Store all users
  const [requirePayment, setRequirePayment] = useState(true);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  const navigate = useNavigate();

  const refreshFlaggedListings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/admin/flagged-listings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFlaggedListings(response.data);
      
      // Also refresh stats
      const statsResponse = await axios.get(`${API_BASE_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error refreshing flagged listings:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const [statsRes, listingsRes, featuredRes, usersRes, flaggedRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/admin/recent-listings`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/admin/featured-listings`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/admin/recent-users`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/admin/flagged-listings`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setStats(statsRes.data);
        setRecentListings(listingsRes.data);
        setFeaturedListings(featuredRes.data);
        setRecentUsers(usersRes.data);
        setFlaggedListings(flaggedRes.data);
      } catch (err) {
        setStats(null);
        setRecentListings([]);
        setFeaturedListings([]);
        setRecentUsers([]);
        setFlaggedListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch all users when 'users', 'landlords', or 'students' card is selected and not already loaded
  useEffect(() => {
    if (
      (['users', 'landlords', 'students'].includes(selectedCard)) &&
      allUsers.length === 0
    ) {
      const token = localStorage.getItem('token');
      axios.get(`${API_BASE_URL}/api/admin/all-users`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setAllUsers(res.data))
        .catch(() => setAllUsers([]));
    }
  }, [selectedCard, allUsers.length]);

  useEffect(() => {
    // Fetch payment requirement
    const fetchPaymentRequirement = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/payment-requirement`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequirePayment(res.data.requirePaymentForListing);
      } catch {}
    };
    fetchPaymentRequirement();
  }, []);

  const handleTogglePayment = async () => {
    setUpdatingPayment(true);
    try {
      const token = localStorage.getItem('token');
      const newValue = !requirePayment;
      await axios.post(`${API_BASE_URL}/api/admin/payment-requirement`, { requirePaymentForListing: newValue }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequirePayment(newValue);
    } catch {
      alert('Failed to update payment requirement');
    } finally {
      setUpdatingPayment(false);
    }
  };

  const handleDeleteFlaggedListing = (listingId, listingName) => {
    setListingToDelete({ id: listingId, name: listingName });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!listingToDelete) return;

    setDeletingListing(true);
    try {
      const token = localStorage.getItem('token');
      
      if (listingToDelete.id === 'all') {
        // Delete all flagged listings using bulk endpoint
        const response = await axios.delete(`${API_BASE_URL}/api/admin/flagged-listings/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Clear all flagged listings from state
        setFlaggedListings([]);
        
        // Update stats
        setStats(prev => prev ? { 
          ...prev, 
          flaggedListings: 0, 
          totalListings: prev.totalListings - response.data.deletedCount 
        } : prev);
        
        alert(response.data.message);
      } else {
        // Delete single listing
        await axios.delete(`${API_BASE_URL}/api/admin/flagged-listing/${listingToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Remove from local state
        setFlaggedListings(prev => prev.filter(l => l._id !== listingToDelete.id));
        
        // Update stats
        setStats(prev => prev ? { ...prev, flaggedListings: prev.flaggedListings - 1, totalListings: prev.totalListings - 1 } : prev);
        
        alert('Flagged listing deleted successfully');
      }
      
      setDeleteModalOpen(false);
      setListingToDelete(null);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete flagged listing';
      alert(message);
    } finally {
      setDeletingListing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="text-center py-12">Loading admin dashboard...</div>;

  // Card definitions for easier mapping
  const cards = [
    {
      key: 'users',
      label: 'Total Users',
      value: stats?.totalUsers,
      icon: <FaUsers className="text-3xl text-blue-700 mb-2" />, 
      border: 'border-blue-700',
    },
    {
      key: 'landlords',
      label: 'Landlords',
      value: stats?.totalLandlords,
      icon: <FaUserTie className="text-3xl text-blue-600 mb-2" />, 
      border: 'border-blue-500',
    },
    {
      key: 'students',
      label: 'Students',
      value: stats?.totalStudents,
      icon: <FaUserGraduate className="text-3xl text-blue-400 mb-2" />, 
      border: 'border-blue-400',
    },
    {
      key: 'listings',
      label: 'Total Listings',
      value: stats?.totalListings,
      icon: <FaHome className="text-3xl text-green-700 mb-2" />, 
      border: 'border-green-700',
    },
    {
      key: 'paid',
      label: 'Paid Listings',
      value: stats?.paidListings,
      icon: <FaMoneyBillWave className="text-3xl text-green-600 mb-2" />, 
      border: 'border-green-500',
    },
    {
      key: 'featured',
      label: 'Featured Listings',
      value: stats?.featuredListings,
      icon: <FaStar className="text-3xl text-yellow-500 mb-2" />, 
      border: 'border-yellow-500',
    },
    {
      key: 'flagged',
      label: 'Flagged Listings',
      value: stats?.flaggedListings,
      icon: <FaFlag className="text-3xl text-red-500 mb-2" />, 
      border: 'border-red-500',
    },
    {
      key: 'performance',
      label: 'Performance',
      value: 'Monitor',
      icon: <FaChartLine className="text-3xl text-purple-600 mb-2" />, 
      border: 'border-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <BackButton />
        </div>
        <h1 className="text-4xl font-extrabold text-blue-900 mb-8 text-center drop-shadow-lg animate-fade-in">
          <span className="bg-gradient-to-r from-blue-700 via-red-900 to-green-800 bg-clip-text text-transparent">Admin Dashboard</span>
        </h1>
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10 animate-fade-in delay-100">
            {/* Payment Requirement Toggle */}
            <div className="col-span-2 md:col-span-3 flex items-center justify-center mb-4">
              <span className="font-semibold text-blue-900 mr-4">Require Payment for New Listings:</span>
              <Switch
                checked={requirePayment}
                onChange={handleTogglePayment}
                color="primary"
                disabled={updatingPayment}
                inputProps={{ 'aria-label': 'Enable/disable payment for listings' }}
              />
              <span className={`ml-2 font-bold ${requirePayment ? 'text-green-700' : 'text-red-700'}`}>{requirePayment ? 'Enabled' : 'Disabled'}</span>
            </div>
            {cards.map(card => (
              <div
                key={card.key}
                className={`bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border-t-4 cursor-pointer transition-all duration-200 ${card.border} ${selectedCard === card.key ? 'ring-4 ring-blue-300 scale-105' : ''}`}
                onClick={() => setSelectedCard(card.key)}
                tabIndex={0}
                role="button"
                aria-pressed={selectedCard === card.key}
                title={`Show ${card.label}`}
              >
                {card.icon}
                <div className={`text-3xl font-extrabold ${card.key === 'featured' ? 'text-yellow-500' : card.key === 'flagged' ? 'text-red-500' : card.key === 'listings' ? 'text-green-700' : card.key === 'paid' ? 'text-green-600' : card.key === 'students' ? 'text-blue-400' : card.key === 'landlords' ? 'text-blue-600' : 'text-blue-700'}`}>{card.value}</div>
                <div className="text-gray-600 font-semibold mt-1">{card.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Conditional Section Rendering */}
        {selectedCard === 'listings' && (
          <div className="grid md:grid-cols-2 gap-10 animate-fade-in delay-200">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2"><FaHome className="text-green-700" /> Recent Listings</h2>
              <ul className="bg-white rounded-xl shadow-lg p-4 divide-y border border-blue-100">
                {recentListings.length === 0 ? <li className="text-gray-500">No recent listings.</li> : recentListings.map(l => (
                  <li key={l._id} className="py-3 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-blue-700 text-lg">{l.name}</div>
                      <button
                        className={`ml-2 px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                          l.isFeatured 
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                            : 'bg-yellow-500 text-white hover:bg-yellow-600'
                        }`}
                        onClick={async () => {
                          const token = localStorage.getItem('token');
                          try {
                            const response = await axios.patch(`${API_BASE_URL}/api/admin/toggle-featured/${l._id}`, {}, { 
                              headers: { Authorization: `Bearer ${token}` } 
                            });
                            setRecentListings(listings => listings.map(item => 
                              item._id === l._id ? { ...item, isFeatured: response.data.isFeatured } : item
                            ));
                            if (response.data.isFeatured) {
                              setFeaturedListings(prev => [l, ...prev]);
                            } else {
                              setFeaturedListings(prev => prev.filter(item => item._id !== l._id));
                            }
                            setStats(s => s ? { 
                              ...s, 
                              featuredListings: response.data.isFeatured 
                                ? s.featuredListings + 1 
                                : s.featuredListings - 1 
                            } : s);
                            alert(response.data.message);
                          } catch (err) {
                            alert('Failed to toggle featured status.');
                          }
                        }}
                      >
                        <FaStar />
                        {l.isFeatured ? 'Featured' : 'Feature'}
                      </button>
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
        )}

        {selectedCard === 'users' && (
          <div className="mt-10 animate-fade-in delay-200">
            <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2"><FaUsers className="text-blue-700" /> All Users</h2>
            <ul className="bg-white rounded-xl shadow-lg p-4 divide-y border border-blue-100 mb-8">
              {allUsers.length === 0 ? <li className="text-gray-500">No users found.</li> : allUsers.map(u => (
                <li key={u._id} className="py-3">
                  <div className="font-bold text-blue-700 text-lg">{u.firstName} {u.lastName}</div>
                  <div className="text-xs text-gray-500">{u.email} &bull; {u.role}</div>
                </li>
              ))}
            </ul>
            <h2 className="text-xl font-bold mb-4 text-blue-800 flex items-center gap-2"><FaUsers className="text-blue-700" /> Recent Users</h2>
            <ul className="bg-white rounded-xl shadow-lg p-4 divide-y border border-blue-100">
              {recentUsers.length === 0 ? <li className="text-gray-500">No recent users.</li> : recentUsers.map(u => (
                <li key={u._id} className="py-3">
                  <div className="font-bold text-blue-700 text-lg">{u.firstName} {u.lastName}</div>
                  <div className="text-xs text-gray-500">{u.email} &bull; {u.role}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedCard === 'landlords' && (
          <div className="mt-10 animate-fade-in delay-200">
            <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2"><FaUserTie className="text-blue-600" /> Landlords</h2>
            <ul className="bg-white rounded-xl shadow-lg p-4 divide-y border border-blue-100">
              {allUsers.filter(u => u.role && u.role.toLowerCase() === 'landlord').length === 0 ? <li className="text-gray-500">No landlords found.</li> : allUsers.filter(u => u.role && u.role.toLowerCase() === 'landlord').map(u => (
                <li key={u._id} className="py-3 cursor-pointer hover:bg-blue-50 rounded transition" onClick={() => navigate(`/admin/landlord-listings/${u._id}`)} title="View this landlord's listings">
                  <div className="font-bold text-blue-700 text-lg">{u.firstName} {u.lastName}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedCard === 'students' && (
          <div className="mt-10 animate-fade-in delay-200">
            <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2"><FaUserGraduate className="text-blue-400" /> Students</h2>
            <ul className="bg-white rounded-xl shadow-lg p-4 divide-y border border-blue-100">
              {allUsers.filter(u => u.role && u.role.toLowerCase() === 'student').length === 0 ? <li className="text-gray-500">No students found.</li> : allUsers.filter(u => u.role && u.role.toLowerCase() === 'student').map(u => (
                <li key={u._id} className="py-3">
                  <div className="font-bold text-blue-700 text-lg">{u.firstName} {u.lastName}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedCard === 'flagged' && (
          <div className="mt-10 animate-fade-in delay-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2"><FaFlag className="text-red-700" /> Flagged Properties</h2>
              {flaggedListings.length > 0 && (
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 transition"
                    onClick={async () => {
                      const token = localStorage.getItem('token');
                      try {
                        const response = await axios.post(`${API_BASE_URL}/api/admin/whatsapp-notify-all`, {}, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        const notificationList = response.data.notifications.map(n => 
                          `${n.landlordName} (${n.listingName})`
                        ).join('\n');
                        alert(`Prepared ${response.data.notifications.length} WhatsApp notifications:\n\n${notificationList}`);
                        if (response.data.notifications.length > 0) {
                          window.open(response.data.notifications[0].whatsappUrl, '_blank');
                        }
                      } catch (err) {
                        alert('Failed to prepare bulk WhatsApp notifications.');
                      }
                    }}
                    title="Send WhatsApp notifications to all flagged landlords"
                  >
                    📱 Notify All
                  </button>
                  <button
                    className="px-4 py-2 bg-red-800 text-white text-sm font-bold rounded hover:bg-red-900 transition disabled:opacity-50"
                    onClick={() => {
                      setListingToDelete({ id: 'all', name: 'all flagged properties' });
                      setDeleteModalOpen(true);
                    }}
                    disabled={deletingListing}
                    title="Delete all flagged properties"
                  >
                    Delete All Flagged
                  </button>
                </div>
              )}
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 border border-red-100">
              {flaggedListings.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-green-600 text-lg font-semibold mb-2">Flagged properties have been resolved!</div>
                  <div className="text-gray-500">No properties are currently flagged. Great job maintaining listing quality!</div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {flaggedListings.map(l => (
                    <div key={l._id} className="border border-red-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-red-700 text-lg">{l.name}</div>
                        <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1">
                          <FaFlag /> {l.flagCount} flags
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {l.university} &bull; {l.rent} Ksh &bull; {l.landlord?.firstName} {l.landlord?.lastName}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="flex-1 px-3 py-2 rounded bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition"
                          onClick={() => {
                            setSelectedListing(l);
                            setFlagModalOpen(true);
                          }}
                        >
                          View Flags
                        </button>
                        <button
                          className="px-3 py-2 rounded bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition"
                          onClick={async () => {
                            const token = localStorage.getItem('token');
                            try {
                              const response = await axios.post(`${API_BASE_URL}/api/admin/whatsapp-notify/${l._id}`, {}, {
                                headers: { Authorization: `Bearer ${token}` }
                              });
                              window.open(response.data.whatsappUrl, '_blank');
                              alert(`WhatsApp notification prepared for ${response.data.landlordName}`);
                            } catch (err) {
                              alert('Failed to prepare WhatsApp notification.');
                            }
                          }}
                          title="Send WhatsApp notification to landlord"
                        >
                          📱 WhatsApp
                        </button>
                        <button
                          className="px-3 py-2 rounded bg-red-800 text-white text-sm font-bold hover:bg-red-900 transition disabled:opacity-50"
                          onClick={() => handleDeleteFlaggedListing(l._id, l.name)}
                          disabled={deletingListing}
                          title="Delete this flagged property"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedCard === 'featured' && (
          <div className="mt-10 animate-fade-in delay-400">
            <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2"><FaStar className="text-yellow-600" /> Featured Properties</h2>
            <div className="bg-white rounded-xl shadow-lg p-4 border border-yellow-100">
              {featuredListings.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No featured properties.</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredListings.map(l => (
                    <div key={l._id} className="border border-yellow-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-yellow-700 text-lg">{l.name}</div>
                        <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-bold flex items-center gap-1">
                          <FaStar /> Featured
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {l.university} &bull; {l.rent} Ksh &bull; {l.landlord?.firstName} {l.landlord?.lastName}
                      </div>
                      <button
                        className="w-full px-3 py-2 rounded bg-yellow-600 text-white text-sm font-bold hover:bg-yellow-700 transition"
                        onClick={async () => {
                          const token = localStorage.getItem('token');
                          try {
                            const response = await axios.patch(`${API_BASE_URL}/api/admin/toggle-featured/${l._id}`, {}, { 
                              headers: { Authorization: `Bearer ${token}` } 
                            });
                            setFeaturedListings(listings => listings.filter(item => item._id !== l._id));
                            setRecentListings(listings => listings.map(item => 
                              item._id === l._id ? { ...item, isFeatured: false } : item
                            ));
                            setStats(s => s ? { 
                              ...s, 
                              featuredListings: s.featuredListings - 1
                            } : s);
                            alert(response.data.message);
                          } catch (err) {
                            alert('Failed to toggle featured status.');
                          }
                        }}
                      >
                        Remove Featured Status
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedCard === 'performance' && (
          <div className="mt-10 animate-fade-in delay-200">
            <CacheManager />
          </div>
        )}

      </div>

      {/* Flag Details Modal */}
      {selectedListing && (
        <FlagDetailsModal
          isOpen={flagModalOpen}
          onClose={() => {
            setFlagModalOpen(false);
            setSelectedListing(null);
          }}
          listingId={selectedListing._id}
          listingName={selectedListing.name}
          onFlagUpdate={refreshFlaggedListings}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setListingToDelete(null);
        }}
        onConfirm={confirmDelete}
        listingName={listingToDelete?.name || ''}
        loading={deletingListing}
      />
    </div>
  );
};

export default AdminDashboard;
