const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  popularityScore: { type: Number, default: 0 },
  requestCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema);
