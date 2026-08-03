const mongoose = require('mongoose');

const bailRecordSchema = new mongoose.Schema({
  bailId: { type: String, unique: true },
  case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  criminal: { type: mongoose.Schema.Types.ObjectId, ref: 'Criminal', required: true },
  applicationDate: { type: Date, required: true },
  applicationType: {
    type: String,
    enum: ['regular', 'anticipatory', 'interim', 'permanent'],
    default: 'regular',
  },
  defenseLawyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  prosecutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  judge: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hearingDate: { type: Date },
  nextHearingDate: { type: Date },
  bailAmount: { type: Number, default: 0 },
  suretyAmount: { type: Number, default: 0 },
  suretyName: { type: String, trim: true },
  suretyNid: { type: String, trim: true },
  suretyAddress: { type: String, trim: true },
  suretyContact: { type: String, trim: true },
  suretyOccupation: { type: String, trim: true },
  conditions: [{
    type: String,
    enum: ['cash', 'guarantee', 'bond', 'restrictions'],
  }],
  additionalConditions: { type: String, trim: true },
  decisionDate: { type: Date },
  decision: {
    type: String,
    enum: ['granted', 'denied', 'pending', 'cancelled'],
    default: 'pending',
  },
  decisionReason: { type: String, trim: true },
  bailOrderUrl: { type: String },
  punishment: { type: String, trim: true },
  punishment_bn: { type: String, trim: true },
  notes: { type: String, trim: true },
  notes_bn: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

bailRecordSchema.pre('save', async function () {
  if (!this.bailId) {
    const count = await mongoose.model('BailRecord').countDocuments();
    this.bailId = `BL-${String(count + 1).padStart(5, '0')}`;
  }
});

bailRecordSchema.index({ case: 1 });
bailRecordSchema.index({ criminal: 1 });
bailRecordSchema.index({ judge: 1 });
bailRecordSchema.index({ decision: 1 });
bailRecordSchema.index({ bailDate: -1 });

module.exports = mongoose.model('BailRecord', bailRecordSchema);
