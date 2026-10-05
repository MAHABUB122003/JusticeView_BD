const mongoose = require('mongoose');

const hearingSchema = new mongoose.Schema({
  hearingId: { type: String, unique: true },
  case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  hearingDate: { type: Date, required: true },
  hearingTime: { type: String, required: true },
  courtRoom: { type: String, required: true },
  judge: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hearingType: {
    type: String,
    enum: ['main', 'preliminary', 'final', 'adjournment', 'bail', 'motion', 'others'],
    required: true,
  },
  hearingStatus: {
    type: String,
    enum: ['scheduled', 'completed', 'adjourned', 'cancelled', 'rescheduled'],
    default: 'scheduled',
  },
  nextHearingDate: { type: Date },
  hearingSummaryEnglish: { type: String },
  hearingSummaryBangla: { type: String },
  attendees: { type: mongoose.Schema.Types.Mixed },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

hearingSchema.pre('save', async function () {
  if (!this.hearingId) {
    const count = await mongoose.model('Hearing').countDocuments();
    this.hearingId = `HRG-${String(count + 1).padStart(5, '0')}`;
  }
});

hearingSchema.index({ case: 1 });
hearingSchema.index({ judge: 1 });
hearingSchema.index({ hearingDate: 1 });
hearingSchema.index({ hearingStatus: 1 });

module.exports = mongoose.model('Hearing', hearingSchema);
