const mongoose = require('mongoose');

const bailRecordSchema = new mongoose.Schema({
  case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  criminal: { type: mongoose.Schema.Types.ObjectId, ref: 'Criminal', required: true },
  lawyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer' },
  judge: { type: mongoose.Schema.Types.ObjectId, ref: 'Judge' },
  bailDate: { type: Date, required: true },
  bailAmount: { type: Number, default: 0 },
  conditions: [{
    type: String,
    enum: ['cash', 'guarantee', 'bond', 'restrictions'],
  }],
  hearingDate: { type: Date },
  nextHearingDate: { type: Date },
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

bailRecordSchema.index({ case: 1 });
bailRecordSchema.index({ criminal: 1 });
bailRecordSchema.index({ judge: 1 });
bailRecordSchema.index({ lawyer: 1 });
bailRecordSchema.index({ bailDate: -1 });

module.exports = mongoose.model('BailRecord', bailRecordSchema);
