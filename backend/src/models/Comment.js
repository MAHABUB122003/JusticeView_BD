const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  text: { type: String, required: true, trim: true },
  text_bn: { type: String, trim: true },
  type: {
    type: String,
    enum: ['public_complaint', 'internal_note', 'inquiry'],
    default: 'public_complaint',
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

commentSchema.index({ case: 1 });
commentSchema.index({ status: 1 });

module.exports = mongoose.model('Comment', commentSchema);
