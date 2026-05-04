const Message = require('../models/Message');

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ success: false, message: 'Please provide receiver ID and message text' });
    }

    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      text,
    });

    await message.populate([
      { path: 'sender', select: '-password' },
      { path: 'receiver', select: '-password' },
    ]);

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/messages/:userId
// @desc    Get conversation between two users
// @access  Private
exports.getConversation = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id },
      ],
    })
      .populate([
        { path: 'sender', select: '-password' },
        { path: 'receiver', select: '-password' },
      ])
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/messages
// @desc    Get all conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    // Get unique user IDs from messages
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
      .populate([
        { path: 'sender', select: '-password' },
        { path: 'receiver', select: '-password' },
      ])
      .sort({ createdAt: -1 });

    // Group by conversation
    const conversations = {};
    messages.forEach((msg) => {
      const otherUserId = msg.sender._id.toString() === req.user.id ? msg.receiver._id : msg.sender._id;
      const userId = otherUserId.toString();

      if (!conversations[userId]) {
        const otherUser = msg.sender._id.toString() === req.user.id ? msg.receiver : msg.sender;
        conversations[userId] = {
          user: otherUser,
          lastMessage: msg.text,
          lastMessageTime: msg.createdAt,
          unreadCount: 0,
        };
      }

      // Count unread messages
      if (msg.receiver._id.toString() === req.user.id && !msg.read) {
        conversations[userId].unreadCount++;
      }
    });

    res.status(200).json({
      success: true,
      conversations: Object.values(conversations),
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    ).populate([
      { path: 'sender', select: '-password' },
      { path: 'receiver', select: '-password' },
    ]);

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};
