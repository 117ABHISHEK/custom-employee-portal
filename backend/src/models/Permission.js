const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. 'access:zoho_people', 'manage:users'
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Permission', permissionSchema);