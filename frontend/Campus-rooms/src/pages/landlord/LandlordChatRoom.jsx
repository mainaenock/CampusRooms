import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SOCKET_URL = 'http://localhost:3000';

const LandlordChatRoom = ({ landlordId }) => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeStudent, setActiveStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setLoadingConvs(true);
    async function fetchConversations() {
      try {
        const res = await axios.get('http://localhost:3000/api/chat/user-conversations', {
          params: { userId: landlordId }
        });
        setConversations(res.data);
      } catch (err) {
        setConversations([]);
      }
      setLoadingConvs(false);
    }
    fetchConversations();
  }, [landlordId]);

  useEffect(() => {
    if (!activeStudent) return;
    setLoadingMsgs(true);
    async function fetchMessages() {
      try {
        const res = await axios.get('http://localhost:3000/api/chat/history', {
          params: {
            listingId: activeStudent.listingId,
            userId: landlordId,
            otherId: activeStudent.otherUser
          }
        });
        setMessages(res.data || []);
      } catch (err) {
        setMessages([]);
      }
      setLoadingMsgs(false);
    }
    fetchMessages();
    // Setup socket for real-time updates
    let s = socket;
    if (!s) {
      s = io(SOCKET_URL, { transports: ['websocket'] });
      setSocket(s);
    }
    s.emit('joinRoom', { listingId: activeStudent.listingId, userId: landlordId });
    s.off('chatMessage');
    s.on('chatMessage', (msg) => {
      // Show messages for this chat (either direction)
      if (
        (msg.sender === landlordId && msg.receiver === activeStudent.otherUser) ||
        (msg.sender === activeStudent.otherUser && msg.receiver === landlordId)
      ) {
        setMessages(prev => [...prev, msg]);
      }
    });
    return () => {
      s.off('chatMessage');
    };
  }, [activeStudent, landlordId]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeStudent) return;
    setSending(true);
    const msg = {
      listingId: activeStudent.listingId,
      sender: landlordId,
      receiver: activeStudent.otherUser,
      message: input.trim(),
    };
    if (socket) {
      socket.emit('chatMessage', msg);
    }
    setInput('');
    setTimeout(() => setSending(false), 400);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Student Messages</h2>
      <div className="flex gap-8">
        <div className="w-1/3">
          <h3 className="font-bold mb-2">Students</h3>
          {loadingConvs ? (
            <div className="text-center text-gray-400 mt-8">Loading conversations...</div>
          ) : (
            <ul className="space-y-2">
              {conversations.map((conv, idx) => (
                <li key={idx}>
                  <button
                    className={`w-full text-left px-4 py-2 rounded ${activeStudent && activeStudent.otherUser === conv.otherUser ? 'bg-blue-100' : 'bg-white'} hover:bg-blue-50`}
                    onClick={() => setActiveStudent(conv)}
                  >
                    <div className="font-semibold text-blue-700">{conv.otherUserName}</div>
                    <div className="text-xs text-gray-500">{conv.listingName}</div>
                    <div className="text-xs text-gray-400">Last: {conv.lastMessage}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex-1 bg-white rounded-lg shadow p-4">
          {activeStudent ? (
            <>
              <h3 className="font-bold text-lg mb-2">Chat with {activeStudent.otherUserName}</h3>
              <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2 h-[50vh] bg-blue-50 rounded">
                {loadingMsgs ? (
                  <div className="text-center text-gray-400 mt-8">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-400 mt-8">No messages yet.</div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === landlordId ? 'justify-end' : 'justify-start'}`}>
                      <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender === landlordId ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                        <div className="text-xs font-semibold mb-1">{msg.sender === landlordId ? 'You' : activeStudent.otherUserName}</div>
                        <div>{msg.message}</div>
                        <div className="text-[10px] text-right text-gray-400 mt-1">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}</div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessage} className="flex items-center p-2 border-t bg-white mt-2">
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
            </>
          ) : (
            <div className="text-gray-500">Select a student to view messages.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandlordChatRoom;
