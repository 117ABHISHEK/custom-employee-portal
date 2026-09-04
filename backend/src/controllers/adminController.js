const User = require('../models/User');
const Role = require('../models/Role');
const UserRole = require('../models/UserRole');
const AuditLog = require('../models/AuditLog');

// POST /api/admin/assign-role  { userId, roleName }
exports.assignRole = async (req, res) => {
  try {
    const { userId, roleName } = req.body;
    if (!userId || !roleName) {
      return res.status(400).json({ message: 'userId and roleName are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const role = await Role.findOne({ name: roleName });
    if (!role) return res.status(404).json({ message: 'Role not found' });

    // Remove any existing role assignment (one role per user, per your doc's model)
    await UserRole.deleteMany({ user: userId });
    await UserRole.create({ user: userId, role: role._id });

    await AuditLog.create({
      user: req.user.userId,
      action: 'ROLE_ASSIGNED',
      target: `user:${userId} -> role:${roleName}`,
      ipAddress: req.ip
    });

    res.json({ message: `Role '${roleName}' assigned to user ${userId}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/admin/audit-logs
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};