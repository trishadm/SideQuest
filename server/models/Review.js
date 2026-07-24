const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  swapRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest', required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teachingQuality: { type: Number, min: 1, max: 5, required: true },
  communication: { type: Number, min: 1, max: 5, required: true },
  knowledge: { type: Number, min: 1, max: 5, required: true },
  friendliness: { type: Number, min: 1, max: 5, required: true },
  punctuality: { type: Number, min: 1, max: 5, required: true },
  overall: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
