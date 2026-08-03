const mongoose = require('mongoose');

const judgmentSchema = new mongoose.Schema({
  judgmentId: { type: String, unique: true },
  case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  criminal: { type: mongoose.Schema.Types.ObjectId, ref: 'Criminal', required: true },
  judge: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  judgmentDate: { type: Date, required: true },
  judgmentTime: { type: String },
  verdictStatus: {
    type: String,
    enum: ['guilty', 'not_guilty', 'acquitted', 'discharged', 'dismissed', 'sentenced'],
    required: true,
  },
  verdictType: {
    type: String,
    enum: ['conviction', 'acquittal', 'stay', 'adjournment', 'transfer', 'others'],
    default: 'conviction',
  },
  judgmentSummaryEnglish: { type: String },
  judgmentSummaryBangla: { type: String },
  keyPoints: { type: String },
  applicableLaw: { type: String },
  lawSection: { type: String },
  precedentCases: { type: String },
  judgmentOrderUrl: { type: String },
  signedByJudge: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

judgmentSchema.virtual('punishments', {
  ref: 'Punishment',
  localField: '_id',
  foreignField: 'judgment',
});

judgmentSchema.virtual('appeals', {
  ref: 'Appeal',
  localField: '_id',
  foreignField: 'judgment',
});

judgmentSchema.pre('save', async function () {
  if (!this.judgmentId) {
    const count = await mongoose.model('Judgment').countDocuments();
    this.judgmentId = `JUD-${String(count + 1).padStart(5, '0')}`;
  }
});

judgmentSchema.index({ case: 1 });
judgmentSchema.index({ criminal: 1 });
judgmentSchema.index({ judge: 1 });
judgmentSchema.index({ judgmentDate: -1 });

module.exports = mongoose.model('Judgment', judgmentSchema);
