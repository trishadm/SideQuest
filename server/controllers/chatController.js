const Message = require('../models/Message');
const User = require('../models/User');

// @desc Get list of conversations for logged-in user
// @route GET /api/chat/conversations
exports.getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Find all unique users exchanged messages with
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }]
    }).sort({ createdAt: -1 });

    const partnerIds = new Set();
    messages.forEach(msg => {
      if (msg.sender.toString() !== currentUserId) partnerIds.add(msg.sender.toString());
      if (msg.receiver.toString() !== currentUserId) partnerIds.add(msg.receiver.toString());
    });

    const partners = await User.find({ _id: { $in: Array.from(partnerIds) } }).select('name username avatar isOnline lastSeen location ratings');

    // Build summary with last message
    const conversations = partners.map(partner => {
      const lastMsg = messages.find(m => 
        (m.sender.toString() === partner._id.toString() && m.receiver.toString() === currentUserId) ||
        (m.receiver.toString() === partner._id.toString() && m.sender.toString() === currentUserId)
      );

      const unreadCount = messages.filter(m => 
        m.sender.toString() === partner._id.toString() && 
        m.receiver.toString() === currentUserId && 
        !m.isRead
      ).length;

      return {
        partner,
        lastMessage: lastMsg,
        unreadCount
      };
    });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
};

// @desc Get chat messages with specific partner
// @route GET /api/chat/messages/:partnerId
exports.getMessages = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const currentUserId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: partnerId },
        { sender: partnerId, receiver: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    // Mark incoming messages as read
    await Message.updateMany(
      { sender: partnerId, receiver: currentUserId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// @desc Send Message via HTTP REST fallback (Socket.io will also emit it in real-time)
// @route POST /api/chat/messages
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, attachments } = req.body;

    if (!receiverId || (!content && (!attachments || attachments.length === 0))) {
      return res.status(400).json({ message: 'Message content or attachment required' });
    }

    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content: content || '',
      attachments: attachments || []
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};
