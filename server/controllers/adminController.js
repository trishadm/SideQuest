const User = require('../models/User');
const SwapRequest = require('../models/SwapRequest');
const SessionPlan = require('../models/Session');
const Skill = require('../models/Skill');
const Review = require('../models/Review');

// @desc Get Platform Statistics & Analytics
// @route GET /api/admin/stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSwaps = await SwapRequest.countDocuments({ status: 'Accepted' });
    const completedSessions = await SessionPlan.countDocuments({ status: 'Completed' });
    const totalReviews = await Review.countDocuments();

    // Calculate Average Rating across platform
    const reviews = await Review.find();
    const avgRating = reviews.length > 0 
      ? (reviews.reduce((acc, r) => acc + r.overall, 0) / reviews.length).toFixed(1)
      : 4.9;

    // Aggregate Popular Skills Taught
    const users = await User.find().select('teachingSkills learningSkills createdAt');
    
    const teachSkillCounts = {};
    const learnSkillCounts = {};

    users.forEach(user => {
      (user.teachingSkills || []).forEach(s => {
        const name = s.name.trim();
        teachSkillCounts[name] = (teachSkillCounts[name] || 0) + 1;
      });
      (user.learningSkills || []).forEach(s => {
        const name = s.name.trim();
        learnSkillCounts[name] = (learnSkillCounts[name] || 0) + 1;
      });
    });

    const popularSkills = Object.entries(teachSkillCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const requestedSkills = Object.entries(learnSkillCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Monthly Growth (Mock/Real sample dates)
    const monthlyGrowth = [
      { month: 'Jan', newUsers: 14, swaps: 8 },
      { month: 'Feb', newUsers: 28, swaps: 19 },
      { month: 'Mar', newUsers: 45, swaps: 32 },
      { month: 'Apr', newUsers: 62, swaps: 48 },
      { month: 'May', newUsers: 89, swaps: 71 },
      { month: 'Jun', newUsers: 120, swaps: 95 }
    ];

    res.json({
      summary: {
        totalUsers,
        activeSwaps,
        completedSessions,
        totalReviews,
        avgRating
      },
      popularSkills,
      requestedSkills,
      monthlyGrowth
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin statistics', error: error.message });
  }
};

// @desc Get List of Users for Management
// @route GET /api/admin/users
exports.getAdminUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users list' });
  }
};

// @desc Toggle Ban User Account (Remove Fake Accounts)
// @route PUT /api/admin/users/:userId/ban
exports.toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ message: `User ${user.name} has been ${user.isBanned ? 'banned' : 'unbanned'}.`, user });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling user ban status' });
  }
};
