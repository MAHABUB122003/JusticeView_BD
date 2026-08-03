const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  name_bn: { type: String, required: true, trim: true },
  district: { type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true },
  courtType: {
    type: String,
    enum: ['CMM Court', 'District Judge Court', 'Chief Judicial Magistrate Court', 'Magistrate Court', 'Sessions Court'],
    required: true,
  },
  address: { type: String, trim: true },
  address_bn: { type: String, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

courtSchema.virtual('cases', {
  ref: 'Case',
  localField: '_id',
  foreignField: 'court',
});

courtSchema.virtual('judges', {
  ref: 'Judge',
  localField: '_id',
  foreignField: 'court',
});

courtSchema.index({ district: 1 });
courtSchema.index({ courtType: 1 });

module.exports = mongoose.model('Court', courtSchema);
