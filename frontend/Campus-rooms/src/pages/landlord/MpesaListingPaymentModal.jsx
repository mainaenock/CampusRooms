import React, { useState } from 'react';
import axios from 'axios';

const MpesaListingPaymentModal = ({ open, onClose, onSuccess }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/api/chat/mpesa/pay', {
        amount: 149,
        phone,
        accountReference: 'NewListing',
        transactionDesc: 'CampusRooms Listing Fee'
      });
      if (res.data.ResponseCode === '0') {
        setSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        setError('Payment initiation failed.');
      }
    } catch (err) {
      setError('Payment failed.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Pay Ksh 149 to List Your House</h2>
        <form onSubmit={handlePay} className="space-y-4">
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="M-Pesa Phone (2547XXXXXXXX)"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay Ksh 149'}
          </button>
          {error && <div className="text-red-600 mt-2">{error}</div>}
          {success && <div className="text-green-600 mt-2">Payment initiated! Check your phone to complete.</div>}
        </form>
        <button className="mt-4 text-gray-500 hover:text-red-600" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default MpesaListingPaymentModal;
