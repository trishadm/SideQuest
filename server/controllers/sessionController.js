const SessionPlan = require('../models/Session');
const User = require('../models/User');
const { addXP } = require('../services/gamificationService');

// @desc Get active session learning plans
// @route GET /api/sessions
exports.getSessionPlans = async (req, res) => {
  try {
    const plans = await SessionPlan.find({
      $or: [{ userA: req.user.id }, { userB: req.user.id }]
    })
    .populate('userA', 'name username avatar ratings')
    .populate('userB', 'name username avatar ratings')
    .sort({ updatedAt: -1 });

    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching session plans', error: error.message });
  }
};

// @desc Toggle single session completed status
// @route PUT /api/sessions/:planId/toggle-session
exports.toggleSessionItem = async (req, res) => {
  try {
    const { sessionNumber, notes } = req.body;
    const plan = await SessionPlan.findById(req.params.planId);
    if (!plan) return res.status(404).json({ message: 'Session plan not found' });

    const sessionItem = plan.sessions.find(s => s.sessionNumber === parseInt(sessionNumber));
    if (!sessionItem) return res.status(404).json({ message: 'Session milestone not found' });

    sessionItem.isCompleted = !sessionItem.isCompleted;
    if (sessionItem.isCompleted) {
      sessionItem.completedDate = new Date();
      sessionItem.taughtBy = req.user.id;
    }
    if (notes !== undefined) sessionItem.notes = notes;

    // Recalculate completed count
    plan.completedSessionsCount = plan.sessions.filter(s => s.isCompleted).length;

    if (plan.completedSessionsCount >= plan.totalSessions) {
      plan.status = 'Completed';
      
      // Increment completed swaps count for both users
      await User.findByIdAndUpdate(plan.userA, { $inc: { completedSwapsCount: 1 } });
      await User.findByIdAndUpdate(plan.userB, { $inc: { completedSwapsCount: 1 } });

      // Award XP for finishing a full swap plan!
      await addXP(plan.userA, 200, 'Completed a 4-session Swap');
      await addXP(plan.userB, 200, 'Completed a 4-session Swap');
    } else {
      // Award XP for single completed session milestone
      if (sessionItem.isCompleted) {
        await addXP(req.user.id, 50, 'Completed a learning session');
      }
    }

    await plan.save();
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error updating session milestone', error: error.message });
  }
};

// @desc Update shared notes
// @route PUT /api/sessions/:planId/notes
exports.updateSessionNotes = async (req, res) => {
  try {
    const { sharedNotes } = req.body;
    const plan = await SessionPlan.findById(req.params.planId);
    if (!plan) return res.status(404).json({ message: 'Session plan not found' });

    plan.sharedNotes = sharedNotes;
    await plan.save();

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error updating session notes' });
  }
};
