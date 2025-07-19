import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatRoom from './components/ChatRoom';
import { FaArrowLeft, FaComments, FaUserCircle, FaHome, FaClock, FaEnvelope, FaTrash } from 'react-icons/fa';

const getAvatarColor = (name) => {
  // Simple hash for color
  const colors = [
    'bg-blue-200', 'bg-green-200', 'bg-purple-200', 'bg-pink-200', 'bg-yellow-200', 'bg-red-200', 'bg-indigo-200', 'bg-teal-200'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [deleting, setDeleting] = useState(null); // conversation key being deleted
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }
    const userId = user._id || user.id;
    if (!userId) {
      return;
    }
    
    const token = localStorage.getItem('token');
    
    axios.get('http://localhost:3000/api/chat/user-conversations', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setConversations(res.data);
      })
      .catch(err => {
        console.error('API error:', err.response?.status, err.response?.data);
        setConversations([]);
      });
  }, [user]);

  const handleDeleteConversation = async (listingId, otherUserId, key) => {
    if (!window.confirm('Are you sure you want to delete this conversation? This cannot be undone for your account.')) return;
    setDeleting(key);
    try {
      await axios.delete('http://localhost:3000/api/chat/delete-conversation', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        data: { listingId, otherUserId }
      });
      setConversations(prev => prev.filter(
        c => !(c.listingId === listingId && c.otherUser === otherUserId)
      ));
    } catch (err) {
      alert('Failed to delete conversation.');
    } finally {
      setDeleting(null);
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <FaEnvelope className="text-6xl text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Please Log In</h2>
        <p className="text-gray-500">You need to be logged in to view your messages.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center gap-4">
      <button
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition"
        onClick={() => navigate(-1)}
      >
            <FaArrowLeft className="text-xl" />
      </button>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaComments className="text-2xl text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
              <p className="text-gray-500">Stay connected with landlords and students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
      {activeConv ? (
          <div className="bg-white rounded-2xl shadow-lg p-0 md:p-6 border border-blue-100">
        <ChatRoom
          listingId={activeConv.listingId}
          userId={user && (user._id || user.id) ? (user._id || user.id) : ''}
          receiverId={activeConv.otherUser}
          userName={user?.firstName || 'You'}
          receiverName={activeConv.otherUserName}
          onClose={() => setActiveConv(null)}
        />
          </div>
      ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto flex flex-col items-center">
              <FaComments className="text-6xl text-blue-200 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Messages Yet</h3>
              <p className="text-gray-500 mb-6 text-center">Start a conversation by contacting a landlord about a property you're interested in.</p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"
              >
                Browse Properties
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conversations.map((conv, idx) => {
              const key = `${conv.listingId}_${conv.otherUser}`;
              return (
                <div
                  key={key}
                  className={
                    `group bg-white rounded-2xl shadow-md border border-gray-100 p-6 cursor-pointer hover:shadow-xl hover:border-blue-300 transition-all duration-200 flex flex-col justify-between min-h-[170px] relative`
                  }
                  onClick={e => {
                    // Prevent opening chat if trash icon is clicked
                    if (e.target.closest('.delete-conv-btn')) return;
                    setActiveConv(conv);
                  }}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`${getAvatarColor(conv.otherUserName)} rounded-full w-12 h-12 flex items-center justify-center text-2xl text-white shadow-inner`}>
                      <FaUserCircle />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800 text-lg truncate">{conv.otherUserName}</h3>
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                          {user.role === 'student' ? 'Landlord' : 'Student'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <FaHome className="text-gray-400" />
                        <span className="truncate">{conv.listingName}</span>
                      </div>
                    </div>
                    {/* Delete button */}
                    <button
                      className={`delete-conv-btn ml-2 p-2 rounded-full hover:bg-red-100 text-red-600 transition ${deleting === key ? 'opacity-50 pointer-events-none' : ''}`}
                      title="Delete conversation"
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteConversation(conv.listingId, conv.otherUser, key);
                      }}
                      disabled={deleting === key}
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="flex-1 min-h-0">
                    <p className="text-gray-600 truncate text-sm mb-2">{conv.lastMessage || <span className="italic text-gray-400">No messages yet</span>}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <FaClock />
                      <span>
                        {conv.lastTimestamp ? new Date(conv.lastTimestamp).toLocaleDateString() : ''}
                      </span>
                    </div>
              <div>
                      {conv.lastTimestamp ? new Date(conv.lastTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
              </div>
                  <div className="absolute top-3 right-3 bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">Open Chat</div>
            </div>
              );
            })}
        </div>
      )}
      </div>
    </div>
  );
};

export default Messages;
