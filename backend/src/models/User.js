const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'police_officer', 'court_clerk', 'public_user'],
    default: 'public_user',
  },
  phone: { type: String, trim: true },
  thana: { type: mongoose.Schema.Types.ObjectId, ref: 'Thana' },
  court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  refreshToken: { type: String },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

userSchema.index({ role: 1 });

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

module.exports = mongoose.model('User', userSchema);
