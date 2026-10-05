const mongoose = require('mongoose');

const professionalRegistrySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  bn_name: { type: String, required: true, trim: true },
  photo: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  date_of_birth: { type: Date },

  role: {
    type: String,
    required: true,
    enum: ['police_officer', 'lawyer', 'magistrate', 'judge', 'court_official'],
  },

  badge_no: { type: String, unique: true, sparse: true, trim: true },
  rank: {
    type: String,
    enum: ['OC', 'SI', 'ASI', 'Constable', 'Inspector', 'Additional SP', 'SP', 'DIG', 'IGP'],
  },
  thana: { type: mongoose.Schema.Types.ObjectId, ref: 'Thana' },

  bar_council_no: { type: String, unique: true, sparse: true, trim: true },
  lawyer_type: { type: String, enum: ['government', 'private', 'both'] },
  specialization: [{ type: String }],
  law_firm: { type: String, trim: true },
  office_address: { type: String, trim: true },
  bn_office_address: { type: String, trim: true },

  judge_type: {
    type: String,
    enum: ['District Judge', 'Sessions Judge', 'Magistrate', 'CMM', 'High Court Judge', 'Supreme Court Judge'],
  },
  court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court' },

  magistrate_type: {
    type: String,
    enum: ['Executive Magistrate', 'Judicial Magistrate', 'Metropolitan Magistrate'],
  },

  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  present_address: { type: String, trim: true },
  bn_present_address: { type: String, trim: true },
  permanent_address: { type: String, trim: true },
  bn_permanent_address: { type: String, trim: true },

  is_active: { type: Boolean, default: true },
  is_verified: { type: Boolean, default: false },
  verification_status: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'suspended'],
    default: 'pending',
  },

  total_cases_handled: { type: Number, default: 0 },
  total_bails_granted: { type: Number, default: 0 },
  total_convictions: { type: Number, default: 0 },
  years_of_experience: { type: Number, default: 0 },

  education: [{ type: String }],
  training: [{ type: String }],
  awards: [{ type: String }],
  languages_known: [{ type: String }],

  nid: { type: String, unique: true, sparse: true, trim: true },
  passport_no: { type: String, trim: true },

  current_location: {
    district: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
    thana: { type: mongoose.Schema.Types.ObjectId, ref: 'Thana' },
    court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court' },
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

professionalRegistrySchema.virtual('verificationRequests', {
  ref: 'ProfessionalVerificationRequest',
  localField: '_id',
  foreignField: 'professional',
});

professionalRegistrySchema.virtual('caseHistories', {
  ref: 'ProfessionalCaseHistory',
  localField: '_id',
  foreignField: 'professional',
});

professionalRegistrySchema.index({ role: 1, verification_status: 1 });
professionalRegistrySchema.index({ name: 1, bn_name: 1 });
professionalRegistrySchema.index({ 'current_location.district': 1 });
professionalRegistrySchema.index({ 'current_location.thana': 1 });

module.exports = mongoose.model('ProfessionalRegistry', professionalRegistrySchema);
