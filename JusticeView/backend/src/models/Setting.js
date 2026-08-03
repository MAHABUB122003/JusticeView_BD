const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  siteName: { type: String, default: 'JusticeView' },
  siteName_bn: { type: String, default: 'জাস্টিসভিউ' },
  logo: { type: String, default: '' },
  defaultLanguage: { type: String, enum: ['en', 'bn'], default: 'en' },
  maintenanceMode: { type: Boolean, default: false },
  registrationEnabled: { type: Boolean, default: true },
  maxUploadSize: { type: Number, default: 5242880 },
  allowedImageTypes: { type: [String], default: ['image/jpeg', 'image/png', 'image/webp'] },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Setting', settingSchema);
