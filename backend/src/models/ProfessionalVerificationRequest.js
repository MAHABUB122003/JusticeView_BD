const mongoose = require('mongoose');

const professionalVerificationRequestSchema = new mongoose.Schema({
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProfessionalRegistry',
    required: true,
  },
  verification_documents: [{ type: String }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  submitted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  review_notes: { type: String, trim: true },
  submitted_at: { type: Date, default: Date.now },
  reviewed_at: { type: Date },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ProfessionalVerificationRequest', professionalVerificationRequestSchema);
