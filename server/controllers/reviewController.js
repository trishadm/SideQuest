const Review = require('../models/Review');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { addXP } = require('../services/gamificationService');

// @desc Submit Review for a User
// @route POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { swapRequestId, revieweeId, teachingQuality, communication, knowledge, friendliness, punctuality, overall, comment } = req.body;

    if (!swapRequestId || !revieweeId || !comment || !overall) {
      return res.status(400).json({ message: 'Missing required review fields' });
    }

    const review = await Review.create({
      swapRequest: swapRequestId,
      reviewer: req.user.id,
      reviewee: revieweeId,
      teachingQuality: teachingQuality || 5,
      communication: communication || 5,
      knowledge: knowledge || 5,
      friendliness: friendliness || 5,
      punctuality: punctuality || 5,
      overall: overall || 5,
      comment
    });

    // Recalculate reviewee ratings
    const reviewee = await User.findById(revieweeId);
    if (reviewee) {
      const allReviews = await Review.find({ reviewee: revieweeId });
      const total = allReviews.length;

      const avgOverall = allReviews.reduce((acc, r) => acc + r.overall, 0) / total;
      const avgTeach = allReviews.reduce((acc, r) => acc + r.teachingQuality, 0) / total;
      const avgComm = allReviews.reduce((acc, r) => acc + r.communication, 0) / total;
      const avgKnow = allReviews.reduce((acc, r) => acc + r.knowledge, 0) / total;
      const avgFriend = allReviews.reduce((acc, r) => acc + r.friendliness, 0) / total;
      const avgPunct = allReviews.reduce((acc, r) => acc + r.punctuality, 0) / total;

      reviewee.ratings = {
        overall: parseFloat(avgOverall.toFixed(1)),
        teachingQuality: parseFloat(avgTeach.toFixed(1)),
        communication: parseFloat(avgComm.toFixed(1)),
        knowledge: parseFloat(avgKnow.toFixed(1)),
        friendliness: parseFloat(avgFriend.toFixed(1)),
        punctuality: parseFloat(avgPunct.toFixed(1)),
        totalReviews: total
      };

      await reviewee.save();

      // Award XP to mentor for good review!
      if (overall >= 4) {
        await addXP(revieweeId, 150, 'Received positive review');
      }

      // Create notification
      await Notification.create({
        user: revieweeId,
        sender: req.user.id,
        type: 'Review',
        title: 'New Review Received! ⭐',
        message: `${req.user.name} left you a ${overall}★ review: "${comment.slice(0, 40)}..."`,
        link: `/profile/${reviewee.username}`
      });
    }

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting review', error: error.message });
  }
};

// @desc Get Reviews for User
// @route GET /api/reviews/user/:userId
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name username avatar')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};
