const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offeredSkill: { type: String, required: true }, // The skill sender will teach
  requestedSkill: { type: String, required: true }, // The skill receiver will teach
  message: { type: String, required: true },
  availability: { type: String, default: 'Flexible' },
  preferredDuration: { type: String, default: '4 sessions (1 month)' },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected', 'Counter Offer'], 
    default: 'Pending' 
  },
  counterNote: { type: String, default: '' },
  compatibilityScore: { type: Number, default: 85 }
}, {
  timestamps: true
});

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
