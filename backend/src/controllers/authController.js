const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserRole = require('../models/UserRole');
const RolePermission = require('../models/RolePermission');
const Permission = require('../models/Permission');
const AuditLog = require('../models/AuditLog');

// Helper: get a user's role name + permission names
const getUserRoleAndPermissions = async (userId) => {
  const userRole = await UserRole.findOne({ user: userId }).populate('role');
  if (!userRole) return { role: null, permissions: [] };

  const rolePermissions = await RolePermission.find({ role: userRole.role._id }).populate('permission');
  const permissions = rolePermissions.map(rp => rp.permission.name);

  return { role: userRole.role.name, permissions };
};

// POST /api/auth/register  (used by Admin to create users — not public signup)
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { role, permissions } = await getUserRoleAndPermissions(user._id);
    if (!role) {
      return res.status(403).json({ message: 'No role assigned to this user yet' });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, role, permissions },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    await AuditLog.create({
      user: user._id,
      action: 'LOGIN',
      ipAddress: req.ip
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role, permissions }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};