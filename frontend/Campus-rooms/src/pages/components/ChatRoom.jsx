

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

const ChatRoom = ({ listingId, userId, receiverId, userName, receiverName, onClose }) => {
  // Try to get userId from localStorage as fallback
  const getUserId = () => {
    if (userId) return userId;
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData?._id;
  };
  
  const currentUserId = getUserId();
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let cancel = false;
    let socketInstance = null;
    
    async function fetchHistory() {
      if (!listingId || !currentUserId || !receiverId) {
        console.warn('Missing required props for chat:', { listingId, currentUserId, receiverId });
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:3000/api/chat/history', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          params: {
            listingId,
            otherId: receiverId
          }
        });
        if (!cancel) setMessages(res.data || []);
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
      setLoading(false);
    }
    
    async function setupSocket() {
      if (!listingId || !currentUserId) {
        console.warn('Cannot setup socket: missing listingId or userId');
        return;
      }
      
      try {
        socketInstance = io(SOCKET_URL, { 
          transports: ['websocket', 'polling'],
          timeout: 5000,
          reconnection: true,
          reconnectionAttempts: 5,
          withCredentials: true
        });
        
        socketInstance.on('connect', () => {
          socketInstance.emit('joinRoom', { listingId, userId: currentUserId });
        });
        
        socketInstance.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
        });
        
        socketInstance.on('disconnect', (reason) => {
          // Socket disconnected
        });
        
        socketInstance.on('chatMessage', (msg) => {
          setMessages((prev) => [...prev, msg]);
        });
        
        setSocket(socketInstance);
      } catch (error) {
        console.error('Error setting up socket:', error);
      }
    }
    
    fetchHistory();
    setupSocket();
    
    return () => {
      cancel = true;
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [listingId, currentUserId, receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    if (!currentUserId) {
      console.error('Cannot send message: userId is missing');
      return;
    }
    
    if (!socket || !socket.connected) {
      console.error('Cannot send message: socket not connected');
      return;
    }
    
    setSending(true);
    const msg = {
      listingId,
      sender: currentUserId,
      receiver: receiverId,
      message: input.trim(),
    };
    
    try {
      socket.emit('chatMessage', msg);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setTimeout(() => setSending(false), 400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col h-[70vh]">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="font-bold text-blue-700">Chat with {receiverName}</div>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600 text-xl">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-blue-50">
          {loading ? (
            <div className="text-center text-gray-400 mt-8">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">No messages yet.</div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === currentUserId ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender === currentUserId ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">{msg.sender === currentUserId ? userName : receiverName}</span>
                    <span className="text-[10px] text-gray-400 ml-2">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}</span>
                  </div>
                  <div>{msg.message}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="flex items-center p-2 border-t bg-white">
          <input
            className="flex-1 px-3 py-2 rounded border focus:outline-none focus:ring"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={sending}
          />
          <button type="submit" className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50" disabled={!input.trim() || sending}>
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
