const mongoose = require('mongoose');

const appealSchema = new mongoose.Schema({
  appealId: { type: String, unique: true },
  case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  criminal: { type: mongoose.Schema.Types.ObjectId, ref: 'Criminal', required: true },
  judgment: { type: mongoose.Schema.Types.ObjectId, ref: 'Judgment', required: true },
  appealType: {
    type: String,
    enum: ['conviction_appeal', 'sentence_appeal', 'bail_appeal', 'others'],
    required: true,
  },
  filingDate: { type: Date, required: true },
  appellantLawyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  respondentLawyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  appellateCourt: { type: String },
  appealStatus: {
    type: String,
    enum: ['pending', 'hearing', 'approved', 'rejected', 'withdrawn'],
    required: true,
  },
  hearingDate: { type: Date },
  decisionDate: { type: Date },
  decision: { type: String },
  appealReason: { type: String },
  decisionReason: { type: String },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

appealSchema.pre('save', async function () {
  if (!this.appealId) {
    const count = await mongoose.model('Appeal').countDocuments();
    this.appealId = `APL-${String(count + 1).padStart(5, '0')}`;
  }
});

appealSchema.index({ case: 1 });
appealSchema.index({ criminal: 1 });
appealSchema.index({ judgment: 1 });
appealSchema.index({ appealStatus: 1 });

module.exports = mongoose.model('Appeal', appealSchema);
