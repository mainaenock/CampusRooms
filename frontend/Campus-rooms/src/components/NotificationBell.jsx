import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const SOCKET_URL = 'http://localhost:3000';

const NotificationBell = ({ userId }) => {
  const [unread, setUnread] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userId) return;
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socket.on('connect', () => {
      socket.emit('joinRoom', { listingId: 'all', userId });
    });
    socket.on('chatMessage', (msg) => {
      // Only count as unread if not sent by this user
      if (msg.receiver === userId) {
        setUnread((u) => u + 1);
      }
    });
    return () => socket.disconnect();
  }, [userId]);

  return (
    <button onClick={() => navigate('/messages')} className="relative focus:outline-none ml-2" title="Messages">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-blue-700">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold animate-bounce">{unread}</span>
      )}
    </button>
  );
};

export default NotificationBell;
