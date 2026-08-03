const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  evidenceId: { type: String, unique: true },
  case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  evidenceType: {
    type: String,
    enum: ['weapon', 'document', 'photo', 'video', 'witness', 'dna', 'fingerprint', 'digital', 'others'],
    required: true,
  },
  evidenceName: { type: String, required: true },
  evidenceDescription: { type: String },
  evidenceUrl: { type: String },
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collectionDate: { type: Date, required: true },
  collectionLocation: { type: String },
  isSubmitted: { type: Boolean, default: false },
  submittedDate: { type: Date },
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  chainOfCustody: { type: String },
  remarks: { type: String },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

evidenceSchema.pre('save', async function () {
  if (!this.evidenceId) {
    const count = await mongoose.model('Evidence').countDocuments();
    this.evidenceId = `EVD-${String(count + 1).padStart(5, '0')}`;
  }
});

evidenceSchema.index({ case: 1 });
evidenceSchema.index({ evidenceType: 1 });
evidenceSchema.index({ isSubmitted: 1 });

module.exports = mongoose.model('Evidence', evidenceSchema);
