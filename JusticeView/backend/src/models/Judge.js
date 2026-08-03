const mongoose = require('mongoose');

const judgeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  name_bn: { type: String, trim: true },
  court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
  designation: {
    type: String,
    enum: ['District Judge', 'Sessions Judge', 'Magistrate', 'CMM'],
    required: true,
  },
  joiningDate: { type: Date, default: Date.now },
  totalBailsGranted: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

judgeSchema.virtual('bailRecords', {
  ref: 'BailRecord',
  localField: '_id',
  foreignField: 'judge',
});

judgeSchema.index({ court: 1 });

module.exports = mongoose.model('Judge', judgeSchema);
