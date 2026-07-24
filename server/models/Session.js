const mongoose = require('mongoose');

const singleSessionSchema = new mongoose.Schema({
  sessionNumber: { type: Number, required: true },
  title: { type: String, required: true },
  scheduledDate: { type: Date },
  isCompleted: { type: Boolean, default: false },
  completedDate: { type: Date },
  taughtBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String, default: '' }
});

const sessionPlanSchema = new mongoose.Schema({
  swapRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest', required: true },
  userA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userB: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillA: { type: String, required: true }, // Taught by UserA
  skillB: { type: String, required: true }, // Taught by UserB
  totalSessions: { type: Number, default: 4 },
  completedSessionsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['In Progress', 'Completed', 'Cancelled'], default: 'In Progress' },
  sessions: [singleSessionSchema],
  sharedNotes: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('SessionPlan', sessionPlanSchema);
