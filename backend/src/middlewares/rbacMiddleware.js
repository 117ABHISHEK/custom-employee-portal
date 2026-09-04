const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions.includes(permission)) {
      return res.status(403).json({ message: 'Access Denied: Insufficient Permissions' });
    }
    next();
  };
};

module.exports = requirePermission;