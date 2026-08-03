const mongoose = require('mongoose');

const professionalCaseHistorySchema = new mongoose.Schema({
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProfessionalRegistry',
    required: true,
  },
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
  },
  role_in_case: {
    type: String,
    enum: ['arresting_officer', 'prosecutor', 'defense_lawyer', 'judge', 'magistrate'],
    required: true,
  },
  outcome: {
    type: String,
    enum: ['bail_granted', 'bail_denied', 'convicted', 'acquitted', 'pending', 'disposed'],
  },
  date: { type: Date, default: Date.now },
  notes: { type: String, trim: true },
}, {
  timestamps: true,
});

professionalCaseHistorySchema.index({ professional: 1, case: 1 });
professionalCaseHistorySchema.index({ outcome: 1 });

module.exports = mongoose.model('ProfessionalCaseHistory', professionalCaseHistorySchema);
