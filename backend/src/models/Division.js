const mongoose = require('mongoose');

const divisionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  name_bn: { type: String, required: true, trim: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

divisionSchema.virtual('districts', {
  ref: 'District',
  localField: '_id',
  foreignField: 'division',
});

module.exports = mongoose.model('Division', divisionSchema);
