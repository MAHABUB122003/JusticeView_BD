const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  caseNumber: { type: String, required: true, unique: true, trim: true },
  criminal: { type: mongoose.Schema.Types.ObjectId, ref: 'Criminal', required: true },
  arrestingOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'PoliceOfficer', required: true },
  thana: { type: mongoose.Schema.Types.ObjectId, ref: 'Thana', required: true },
  court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court' },
  arrestDate: { type: Date, required: true },
  arrestTime: { type: String },
  courtSentDate: { type: Date },
  sectionLaw: { type: String, trim: true },
  status: {
    type: String,
    enum: ['pending', 'trial', 'disposed', 'appealed'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['normal', 'high', 'urgent'],
    default: 'normal',
  },
  description: { type: String, trim: true },
  description_bn: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

caseSchema.virtual('bailRecords', {
  ref: 'BailRecord',
  localField: '_id',
  foreignField: 'case',
});

caseSchema.index({ criminal: 1 });
caseSchema.index({ thana: 1 });
caseSchema.index({ court: 1 });
caseSchema.index({ arrestingOfficer: 1 });
caseSchema.index({ caseNumber: 1 });
caseSchema.index({ status: 1 });
caseSchema.index({ arrestDate: -1 });

module.exports = mongoose.model('Case', caseSchema);
