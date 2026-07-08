const mongoose = require('mongoose');

const policeOfficerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, trim: true },
  name_bn: { type: String, trim: true },
  designation: {
    type: String,
    enum: ['OC', 'SI', 'ASI', 'Constable', 'Inspector', 'Additional SP', 'SP', 'DIG', 'IGP'],
    required: true,
  },
  badgeNumber: { type: String, required: true, unique: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  thana: { type: mongoose.Schema.Types.ObjectId, ref: 'Thana', required: true },
  joinDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

policeOfficerSchema.virtual('cases', {
  ref: 'Case',
  localField: '_id',
  foreignField: 'arrestingOfficer',
});

policeOfficerSchema.index({ thana: 1 });

module.exports = mongoose.model('PoliceOfficer', policeOfficerSchema);
