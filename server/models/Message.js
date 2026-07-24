const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, default: '' },
  attachments: [{
    url: String,
    fileName: String,
    fileType: String // 'image', 'document', etc.
  }],
  isRead: { type: Boolean, default: false },
  readAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
