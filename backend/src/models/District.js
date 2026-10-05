const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  name_bn: { type: String, required: true, trim: true },
  code: { type: String, trim: true },
  division: { type: mongoose.Schema.Types.ObjectId, ref: 'Division', required: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

districtSchema.virtual('thanas', {
  ref: 'Thana',
  localField: '_id',
  foreignField: 'district',
});

districtSchema.index({ division: 1 });
districtSchema.index({ name: 1 });

module.exports = mongoose.model('District', districtSchema);
