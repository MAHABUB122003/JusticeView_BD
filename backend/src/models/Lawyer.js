const mongoose = require('mongoose');

const lawyerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  name_bn: { type: String, trim: true },
  barCouncilNumber: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  officeAddress: { type: String, trim: true },
  officeAddress_bn: { type: String, trim: true },
  specialization: { type: String, trim: true },
  district: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
  totalCases: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

lawyerSchema.virtual('bailRecords', {
  ref: 'BailRecord',
  localField: '_id',
  foreignField: 'lawyer',
});

lawyerSchema.index({ barCouncilNumber: 1 });
lawyerSchema.index({ name: 1 });

module.exports = mongoose.model('Lawyer', lawyerSchema);
