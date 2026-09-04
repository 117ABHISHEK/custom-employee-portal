const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true }, // e.g. 'LOGIN', 'ACCESS_ZOHO_CRM', 'ROLE_ASSIGNED'
  target: { type: String }, // e.g. affected resource or user id
  ipAddress: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed } // flexible field for extra context
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);