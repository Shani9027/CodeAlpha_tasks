const express = require('express');
const {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead,
} = require('../controllers/messageController');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/', protect, getConversations);
router.get('/:userId', protect, getConversation);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
