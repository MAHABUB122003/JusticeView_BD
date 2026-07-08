const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'police_officer', 'court_clerk', 'judge', 'lawyer', 'prosecutor', 'public_user'],
    default: 'public_user',
  },
  designation: { type: String, trim: true },
  badgeNumber: { type: String, trim: true },
  barCouncilNo: { type: String, trim: true },
  phone: { type: String, trim: true },
  policeStation: { type: String, trim: true },
  district: { type: String, trim: true },
  courtName: { type: String, trim: true },
  thana: { type: mongoose.Schema.Types.ObjectId, ref: 'Thana' },
  court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court' },
  profileImage: { type: String },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  refreshToken: { type: String },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT) || 12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

userSchema.index({ role: 1 });
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
