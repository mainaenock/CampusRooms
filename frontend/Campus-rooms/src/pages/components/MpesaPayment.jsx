import React, { useState } from 'react';
import axios from 'axios';

const MpesaPayment = ({ amount, accountReference, transactionDesc, onSuccess }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/api/chat/mpesa/pay', {
        amount,
        phone,
        accountReference,
        transactionDesc
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
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Pay with M-Pesa</h2>
      <form onSubmit={handlePay} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Phone Number</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="e.g. 2547XXXXXXXX"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Amount</label>
          <input type="number" className="w-full border rounded px-3 py-2" value={amount} disabled />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
        {success && <div className="text-green-600 mt-2">Payment initiated! Check your phone to complete.</div>}
      </form>
    </div>
  );
};

export default MpesaPayment;
