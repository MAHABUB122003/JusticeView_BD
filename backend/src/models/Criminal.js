const mongoose = require('mongoose');

const criminalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  name_bn: { type: String, trim: true },
  nid: { type: String, unique: true, sparse: true, trim: true },
  photo: { type: String, default: '' },
  fatherName: { type: String, trim: true },
  fatherName_bn: { type: String, trim: true },
  motherName: { type: String, trim: true },
  motherName_bn: { type: String, trim: true },
  address: { type: String, trim: true },
  address_bn: { type: String, trim: true },
  district: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  occupation: { type: String, trim: true },
  totalCases: { type: Number, default: 0 },
  totalBails: { type: Number, default: 0 },
  isRepeatOffender: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

criminalSchema.virtual('cases', {
  ref: 'Case',
  localField: '_id',
  foreignField: 'criminal',
});

criminalSchema.virtual('bailRecords', {
  ref: 'BailRecord',
  localField: '_id',
  foreignField: 'criminal',
});

criminalSchema.index({ nid: 1 });
criminalSchema.index({ name: 1 });
criminalSchema.index({ isRepeatOffender: 1 });

module.exports = mongoose.model('Criminal', criminalSchema);
