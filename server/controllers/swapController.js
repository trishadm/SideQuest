const SwapRequest = require('../models/SwapRequest');
const SessionPlan = require('../models/Session');
const Notification = require('../models/Notification');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc Send Skill Swap Request
// @route POST /api/swaps
exports.createSwapRequest = async (req, res) => {
  try {
    const { receiverId, offeredSkill, requestedSkill, message, availability, preferredDuration, compatibilityScore } = req.body;

    if (!receiverId || !offeredSkill || !requestedSkill || !message) {
      return res.status(400).json({ message: 'Missing required request parameters' });
    }

    if (receiverId === req.user.id) {
      return res.status(400).json({ message: 'Cannot send a swap request to yourself' });
    }

    const swapRequest = await SwapRequest.create({
      sender: req.user.id,
      receiver: receiverId,
      offeredSkill,
      requestedSkill,
      message,
      availability: availability || 'Flexible',
      preferredDuration: preferredDuration || '4 sessions',
      compatibilityScore: compatibilityScore || 85,
      status: 'Pending'
    });

    // Create Notification for receiver
    await Notification.create({
      user: receiverId,
      sender: req.user.id,
      type: 'SwapRequest',
      title: 'New Skill Swap Request!',
      message: `${req.user.name} wants to swap ${offeredSkill} for ${requestedSkill}`,
      link: '/swaps'
    });

    res.status(201).json(swapRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating swap request', error: error.message });
  }
};

// @desc Get User's Swap Requests (Sent & Received)
// @route GET /api/swaps
exports.getSwapRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
    .populate('sender', 'name username avatar ratings location')
    .populate('receiver', 'name username avatar ratings location')
    .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching swap requests' });
  }
};

// @desc Respond to Swap Request (Accept / Reject / Counter)
// @route PUT /api/swaps/:id/respond
exports.respondSwapRequest = async (req, res) => {
  try {
    const { status, counterNote } = req.body; // status: 'Accepted' | 'Rejected' | 'Counter Offer'
    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) return res.status(404).json({ message: 'Swap request not found' });
    if (swap.receiver.toString() !== req.user.id && swap.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to respond to this request' });
    }

    swap.status = status;
    if (counterNote) swap.counterNote = counterNote;
    await swap.save();

    const otherUserId = (swap.sender.toString() === req.user.id) ? swap.receiver : swap.sender;

    if (status === 'Accepted') {
      // 1. Create shared SessionPlan
      const sessionPlan = await SessionPlan.create({
        swapRequest: swap._id,
        userA: swap.sender,
        userB: swap.receiver,
        skillA: swap.offeredSkill,
        skillB: swap.requestedSkill,
        totalSessions: 4,
        completedSessionsCount: 0,
        sessions: [
          { sessionNumber: 1, title: `Introduction & Fundamentals of ${swap.offeredSkill} & ${swap.requestedSkill}` },
          { sessionNumber: 2, title: `Intermediate Core Practice & Project Setup` },
          { sessionNumber: 3, title: `Advanced Application & Live Feedback Session` },
          { sessionNumber: 4, title: `Final Showcase, Portfolio Review & Feedback` }
        ]
      });

      // 2. Create Initial Welcome Message in Chat
      await Message.create({
        sender: req.user.id,
        receiver: otherUserId,
        content: `🎉 Swap Request Accepted! Excited to swap ${swap.offeredSkill} and ${swap.requestedSkill} with you. Let's schedule our first session!`
      });

      // 3. Notification
      await Notification.create({
        user: otherUserId,
        sender: req.user.id,
        type: 'Accepted',
        title: 'Swap Request Accepted! 🤝',
        message: `${req.user.name} accepted your swap request! You can now start chatting and tracking sessions.`,
        link: '/chat'
      });
    } else if (status === 'Rejected') {
      await Notification.create({
        user: otherUserId,
        sender: req.user.id,
        type: 'Rejected',
        title: 'Swap Request Declined',
        message: `${req.user.name} declined your swap request.`,
        link: '/swaps'
      });
    }

    res.json(swap);
  } catch (error) {
    res.status(500).json({ message: 'Error responding to swap request', error: error.message });
  }
};
