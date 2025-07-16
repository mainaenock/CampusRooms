import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatRoom from './components/ChatRoom';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const userId = user._id || user.id;
    if (!userId) return;
    // Fetch all conversations for this user
    axios.get('http://localhost:3000/api/chat/user-conversations', { params: { userId } })
      .then(res => setConversations(res.data))
      .catch(() => setConversations([]));
  }, [user]);

  if (!user) return <div className="p-8 text-center">Please log in to view your messages.</div>;

  return (
    <div className="min-h-screen bg-blue-50 pt-24 px-4">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Messages</h2>
      {activeConv ? (
        <ChatRoom
          listingId={activeConv.listingId}
          userId={user && (user._id || user.id) ? (user._id || user.id) : ''}
          receiverId={activeConv.otherUser}
          userName={user?.firstName || 'You'}
          receiverName={activeConv.otherUserName}
          onClose={() => setActiveConv(null)}
        />
      ) : conversations.length === 0 ? (
        <div className="text-gray-500">No conversations yet.</div>
      ) : (
        <div className="space-y-4">
          {conversations.map((conv, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-4 flex items-center justify-between cursor-pointer hover:bg-blue-50"
              onClick={() => setActiveConv(conv)}
            >
              <div>
                <div className="font-bold text-blue-700">{conv.otherUserName}</div>
                <div className="text-xs text-gray-500">{conv.listingName}</div>
                <div className="text-sm text-gray-700 mt-1 truncate max-w-xs">{conv.lastMessage}</div>
              </div>
              <div className="text-xs text-gray-400">{conv.lastTimestamp ? new Date(conv.lastTimestamp).toLocaleString() : ''}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;
