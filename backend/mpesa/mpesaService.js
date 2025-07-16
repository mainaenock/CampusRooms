import axios from 'axios';
import moment from 'moment';

const MPESA_BASE_URL = 'https://sandbox.safaricom.co.ke'; // Use production URL for live
const CONSUMER_KEY = 'BUIF6L5YxH7Ptt3ZGUa3h2WTWoLrMhGsir7WDW1OewHb6HDv';
const CONSUMER_SECRET = 'bJCOiFb7lhiAg3c3tKCDmNwA90kQCAFIjGpK1nN7M83UPe6yLqMG3llaKSbwflPk';
const SHORTCODE = '6389398'; // Updated to Safaricom till number
const PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const CALLBACK_URL = 'https://018d1c0ae001.ngrok-free.app/api/mpesa/callback';

async function getAccessToken() {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  const res = await axios.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` }
  });
  return res.data.access_token;
} 

export async function stkPush({ amount, phone, accountReference, transactionDesc }) {
  const accessToken = await getAccessToken();
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');
  const payload = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phone,
    PartyB: SHORTCODE,
    PhoneNumber: phone,
    CallBackURL: CALLBACK_URL,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc
  };
  const res = await axios.post(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, payload, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data;
}
