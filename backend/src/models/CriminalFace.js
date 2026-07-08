const mongoose = require('mongoose');

const criminalFaceSchema = new mongoose.Schema({
  criminal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Criminal',
    required: true,
  },
  face_encoding: {
    type: [Number],
    required: true,
  },
  face_descriptor: {
    type: String,
    required: true,
  },
  face_image_url: {
    type: String,
  },
  confidence_score: {
    type: Number,
    default: 0,
  },
  face_box: {
    x: Number,
    y: Number,
    width: Number,
    height: Number,
  },
  is_primary: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

criminalFaceSchema.index({ criminal: 1 });
criminalFaceSchema.index({ confidence_score: -1 });
criminalFaceSchema.index({ is_primary: 1 });

module.exports = mongoose.model('CriminalFace', criminalFaceSchema);
