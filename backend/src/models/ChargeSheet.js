const mongoose = require('mongoose');

const chargeSheetSchema = new mongoose.Schema({
  chargeSheetId: { type: String, unique: true },
  chargeSheetNo: { type: String, required: true },
  case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  criminal: { type: mongoose.Schema.Types.ObjectId, ref: 'Criminal', required: true },
  investigatingOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  submittedDate: { type: Date, required: true },
  submittedToCourt: { type: Boolean, default: false },
  submissionDateToCourt: { type: Date },
  judgeAcceptance: {
    type: String,
    enum: ['accepted', 'returned', 'pending'],
    default: 'pending',
  },
  charges: { type: mongoose.Schema.Types.Mixed, required: true },
  chargeSheetUrl: { type: String },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

chargeSheetSchema.pre('save', async function () {
  if (!this.chargeSheetId) {
    const count = await mongoose.model('ChargeSheet').countDocuments();
    this.chargeSheetId = `CS-${String(count + 1).padStart(5, '0')}`;
  }
});

chargeSheetSchema.index({ case: 1 });
chargeSheetSchema.index({ criminal: 1 });
chargeSheetSchema.index({ chargeSheetNo: 1 });

module.exports = mongoose.model('ChargeSheet', chargeSheetSchema);
