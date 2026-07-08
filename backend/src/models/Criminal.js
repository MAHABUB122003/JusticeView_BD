const mongoose = require('mongoose');

const criminalSchema = new mongoose.Schema({
  criminalId: { type: String, unique: true },
  name: { type: String, required: true, trim: true },
  name_bn: { type: String, trim: true },
  nid: { type: String, unique: true, sparse: true, trim: true },
  passportNo: { type: String, trim: true },
  dateOfBirth: { type: Date },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  religion: { type: String },
  nationality: { type: String, default: 'Bangladeshi' },
  occupation: { type: String, trim: true },
  fatherName: { type: String, trim: true },
  fatherName_bn: { type: String, trim: true },
  motherName: { type: String, trim: true },
  motherName_bn: { type: String, trim: true },
  presentAddress: { type: String, trim: true },
  presentAddress_bn: { type: String, trim: true },
  permanentAddress: { type: String, trim: true },
  permanentAddress_bn: { type: String, trim: true },
  district: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
  contactNo: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  photo: { type: String, default: '' },
  fingerprintData: { type: String },
  biometricId: { type: String },
  totalCases: { type: Number, default: 0 },
  totalBails: { type: Number, default: 0 },
  totalConvictions: { type: Number, default: 0 },
  isRepeatOffender: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
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

criminalSchema.virtual('judgments', {
  ref: 'Judgment',
  localField: '_id',
  foreignField: 'criminal',
});

criminalSchema.virtual('punishments', {
  ref: 'Punishment',
  localField: '_id',
  foreignField: 'criminal',
});

criminalSchema.virtual('appeals', {
  ref: 'Appeal',
  localField: '_id',
  foreignField: 'criminal',
});

criminalSchema.pre('save', async function () {
  if (!this.criminalId) {
    const count = await mongoose.model('Criminal').countDocuments();
    this.criminalId = `CR-${String(new Date().getFullYear())}-${String(count + 1).padStart(5, '0')}`;
  }
  if (this.dateOfBirth && !this.age) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    this.age = age;
  }
});

criminalSchema.index({ name: 1, name_bn: 1 });
criminalSchema.index({ nid: 1 });
criminalSchema.index({ isRepeatOffender: 1 });
criminalSchema.index({ isActive: 1 });
criminalSchema.index({ district: 1 });

module.exports = mongoose.model('Criminal', criminalSchema);
