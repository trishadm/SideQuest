const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'Award' },
  category: { type: String, default: 'General' },
  xpBonus: { type: Number, default: 100 }
});

module.exports = mongoose.model('Badge', badgeSchema);
