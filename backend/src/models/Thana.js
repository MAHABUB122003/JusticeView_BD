const mongoose = require('mongoose');

const thanaSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  name_bn: { type: String, required: true, trim: true },
  district: { type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true },
  address: { type: String, trim: true },
  address_bn: { type: String, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  latitude: { type: Number },
  longitude: { type: Number },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

thanaSchema.virtual('policeOfficers', {
  ref: 'PoliceOfficer',
  localField: '_id',
  foreignField: 'thana',
});

thanaSchema.index({ district: 1 });
thanaSchema.index({ name: 1 });

module.exports = mongoose.model('Thana', thanaSchema);
