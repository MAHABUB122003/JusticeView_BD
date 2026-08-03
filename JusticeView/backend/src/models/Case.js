const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  caseNumber: { type: String, required: true, unique: true, trim: true },
  year: { type: Number, default: () => new Date().getFullYear() },
  caseType: {
    type: String,
    enum: ['criminal', 'civil', 'family', 'corporate', 'others'],
    default: 'criminal',
  },
  caseStatus: {
    type: String,
    enum: ['pending', 'under_trial', 'reserved', 'disposed', 'dismissed', 'transferred'],
    default: 'pending',
  },
  courtType: {
    type: String,
    enum: ['district_judge', 'cj_magistrate', 'additional_district_judge', 'joint_district_judge', 'assistant_judge', 'high_court', 'appellate', 'special_tribunal'],
  },
  courtName: { type: String, trim: true },
  court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court' },
  district: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
  judge: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  criminal: { type: mongoose.Schema.Types.ObjectId, ref: 'Criminal', required: true },
  arrestingOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'PoliceOfficer', required: true },
  thana: { type: mongoose.Schema.Types.ObjectId, ref: 'Thana', required: true },
  arrestDate: { type: Date, required: true },
  arrestTime: { type: String },
  courtSentDate: { type: Date },
  sectionLaw: { type: String, trim: true },
  lawAct: { type: String, trim: true },
  lawSection: { type: String, trim: true },
  offenseDate: { type: Date },
  offensePlace: { type: String, trim: true },
  firNumber: { type: String, trim: true },
  gdNumber: { type: String, trim: true },
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
  complainantNameEnglish: { type: String, trim: true },
  complainantNameBangla: { type: String, trim: true },
  complainantNid: { type: String, trim: true },
  complainantContact: { type: String, trim: true },
  complainantAddressEnglish: { type: String, trim: true },
  complainantAddressBangla: { type: String, trim: true },
  defenseLawyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  prosecutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, trim: true },
  description_bn: { type: String, trim: true },
  filingDate: { type: Date, default: Date.now },
  nextHearingDate: { type: Date },
  isActive: { type: Boolean, default: true },
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

caseSchema.virtual('judgments', {
  ref: 'Judgment',
  localField: '_id',
  foreignField: 'case',
});

caseSchema.virtual('punishments', {
  ref: 'Punishment',
  localField: '_id',
  foreignField: 'case',
});

caseSchema.virtual('hearings', {
  ref: 'Hearing',
  localField: '_id',
  foreignField: 'case',
});

caseSchema.virtual('chargeSheets', {
  ref: 'ChargeSheet',
  localField: '_id',
  foreignField: 'case',
});

caseSchema.virtual('evidence', {
  ref: 'Evidence',
  localField: '_id',
  foreignField: 'case',
});

caseSchema.virtual('appeals', {
  ref: 'Appeal',
  localField: '_id',
  foreignField: 'case',
});

caseSchema.index({ criminal: 1 });
caseSchema.index({ thana: 1 });
caseSchema.index({ court: 1 });
caseSchema.index({ arrestingOfficer: 1 });
caseSchema.index({ status: 1 });
caseSchema.index({ caseStatus: 1 });
caseSchema.index({ arrestDate: -1 });
caseSchema.index({ caseNumber: 1 });
caseSchema.index({ firNumber: 1 });

module.exports = mongoose.model('Case', caseSchema);
