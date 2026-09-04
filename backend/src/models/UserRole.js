const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true }
}, { timestamps: true });

// Prevent the same user/role pair being inserted twice
userRoleSchema.index({ user: 1, role: 1 }, { unique: true });

module.exports = mongoose.model('UserRole', userRoleSchema);