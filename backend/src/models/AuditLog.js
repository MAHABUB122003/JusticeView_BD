const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: {
    type: String,
    enum: ['create', 'update', 'delete', 'view', 'login', 'logout'],
    required: true,
  },
  model: { type: String, required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId },
  oldData: { type: mongoose.Schema.Types.Mixed },
  newData: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
}, {
  timestamps: true,
});

auditLogSchema.index({ user: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ model: 1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
