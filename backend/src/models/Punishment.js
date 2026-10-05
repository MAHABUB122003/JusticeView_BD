const mongoose = require('mongoose');

const punishmentSchema = new mongoose.Schema({
  punishmentId: { type: String, unique: true },
  case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  criminal: { type: mongoose.Schema.Types.ObjectId, ref: 'Criminal', required: true },
  judgment: { type: mongoose.Schema.Types.ObjectId, ref: 'Judgment', required: true },
  punishmentType: {
    type: String,
    enum: ['imprisonment', 'fine', 'both', 'life_imprisonment', 'death', 'hard_labor', 'exile', 'others'],
    required: true,
  },
  imprisonmentYears: { type: Number, default: 0 },
  imprisonmentMonths: { type: Number, default: 0 },
  imprisonmentDays: { type: Number, default: 0 },
  sentenceType: {
    type: String,
    enum: ['simple', 'rigorous', 'both'],
    default: 'simple',
  },
  fineAmount: { type: Number, default: 0 },
  finePaymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'partially_paid'],
    default: 'pending',
  },
  sentenceStartDate: { type: Date },
  expectedReleaseDate: { type: Date },
  actualReleaseDate: { type: Date },
  prisonLocation: { type: String },
  prisonCell: { type: String },
  prisonDivision: { type: String },
  appealStatus: {
    type: String,
    enum: ['not_filed', 'pending', 'approved', 'rejected'],
    default: 'not_filed',
  },
  appealDate: { type: Date },
  appealDecision: { type: String },
  bailStatus: {
    type: String,
    enum: ['granted', 'denied', 'pending', 'cancelled'],
    default: 'pending',
  },
  releaseType: {
    type: String,
    enum: ['full_release', 'parole', 'bail', 'suspended_sentence'],
    default: 'full_release',
  },
  releaseOrderUrl: { type: String },
  notesEnglish: { type: String },
  notesBangla: { type: String },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

punishmentSchema.pre('save', async function () {
  if (!this.punishmentId) {
    const count = await mongoose.model('Punishment').countDocuments();
    this.punishmentId = `PUN-${String(count + 1).padStart(5, '0')}`;
  }
});

punishmentSchema.index({ case: 1 });
punishmentSchema.index({ criminal: 1 });
punishmentSchema.index({ judgment: 1 });
punishmentSchema.index({ isActive: 1 });

module.exports = mongoose.model('Punishment', punishmentSchema);
