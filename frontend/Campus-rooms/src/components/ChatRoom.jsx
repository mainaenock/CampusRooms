import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000'; // Update if backend runs elsewhere

const ChatRoom = ({ listingId, userId, receiverId, userName, receiverName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ['websocket'] });
    setSocket(s);
    s.emit('joinRoom', { listingId, userId });
    s.on('chatMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      s.disconnect();
    };
  }, [listingId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = {
      listingId,
      sender: userId,
      receiver: receiverId,
      message: input.trim(),
    };
    socket.emit('chatMessage', msg);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col h-[70vh]">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="font-bold text-blue-700">Chat with {receiverName}</div>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600 text-xl">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-blue-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === userId ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender === userId ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                <div className="text-xs font-semibold mb-1">{msg.sender === userId ? userName : receiverName}</div>
                <div>{msg.message}</div>
                <div className="text-[10px] text-right text-gray-400 mt-1">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="flex items-center p-2 border-t bg-white">
          <input
            className="flex-1 px-3 py-2 rounded border focus:outline-none focus:ring"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit" className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
