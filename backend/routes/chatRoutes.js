import express from 'express';
import ChatMessage from '../models/chatMessageModel.js';
import { stkPush } from '../mpesa/mpesaService.js';
import { protect } from '../middlewares/auth.js';


const router = express.Router();

// Test endpoint to check if route is working
router.get('/test', (req, res) => {
  res.json({ message: 'Chat route is working' });
});

// Get count of unread messages for a user
router.get('/unread-count', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  try {
    const count = await ChatMessage.countDocuments({ receiver: userId, read: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});


router.post('/mpesa/pay', async (req, res) => {
  const { amount, phone, accountReference, transactionDesc } = req.body;
  try {
    const result = await stkPush({ amount, phone, accountReference, transactionDesc });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'M-Pesa payment failed', details: err.message });
  }
});

// Callback endpoint for M-Pesa
router.post('/mpesa/callback', (req, res) => {
  // Handle M-Pesa callback here (save payment status, etc.)
  // req.body contains the payment result
  res.status(200).json({ success: true });
});

// Send a chat message (REST API)
router.post('/send', async (req, res) => {
  const { listingId, sender, receiver, message } = req.body;
  if (!listingId || !sender || !receiver || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const chatMsg = new ChatMessage({ listingId, sender, receiver, message, read: false });
    await chatMsg.save();
    res.json({ success: true, chatMsg });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get all conversations for a user (for notification/inbox)
router.get('/user-conversations', protect, async (req, res) => {
  const userId = req.user.id;
  try {
    // Find all messages where user is sender or receiver and NOT deleted by this user
    const messages = await ChatMessage.find({
      $or: [ { sender: userId }, { receiver: userId } ],
      deletedBy: { $ne: userId }
    }).sort({ timestamp: -1 });
    // Group by listing and other user
    const convMap = {};
    messages.forEach(msg => {
      const otherUser = msg.sender == userId ? msg.receiver : msg.sender;
      const key = `${msg.listingId}_${otherUser}`;
      if (!convMap[key]) {
        convMap[key] = {
          listingId: msg.listingId,
          otherUser,
          lastMessage: msg.message,
          lastTimestamp: msg.timestamp,
          sender: msg.sender,
          receiver: msg.receiver
        };
      }
    });
    // Optionally populate listing and user info
    const convs = await Promise.all(Object.values(convMap).map(async c => {
      const listing = await ChatMessage.db.model('Listing').findById(c.listingId);
      const otherUserObj = await ChatMessage.db.model('User').findById(c.otherUser);
      return {
        ...c,
        listingName: listing?.name || '',
        listing,
        otherUserName: otherUserObj ? `${otherUserObj.firstName} ${otherUserObj.lastName}` : 'User'
      };
    }));
    res.json(convs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});


// Get chat history for a listing between two users
router.get('/history', protect, async (req, res) => {
  const userId = req.user.id;
  const { listingId, otherId } = req.query;
  if (!listingId || !userId || !otherId) {
    return res.status(400).json({ error: 'Missing required params' });
  }
  try {
    // Mark all messages sent to userId from otherId in this listing as read
    await ChatMessage.updateMany({
      listingId,
      sender: otherId,
      receiver: userId,
      read: false
    }, { $set: { read: true } });

    // Only fetch messages not deleted by this user
    const messages = await ChatMessage.find({
      listingId,
      $or: [
        { sender: userId, receiver: otherId },
        { sender: otherId, receiver: userId }
      ],
      deletedBy: { $ne: userId }
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Soft-delete a conversation for a user
// DELETE /api/chat/delete-conversation
// Body: { listingId, otherUserId }
router.delete('/delete-conversation', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { listingId, otherUserId } = req.body;
    if (!listingId || !otherUserId) {
      return res.status(400).json({ error: 'Missing listingId or otherUserId' });
    }
    // Mark all messages in this conversation as deleted for this user
    await ChatMessage.updateMany({
      listingId,
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    }, { $addToSet: { deletedBy: userId } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

export default router;
