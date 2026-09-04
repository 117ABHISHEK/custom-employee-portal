const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const requirePermission = require('../middlewares/rbacMiddleware');
const { assignRole, getAuditLogs } = require('../controllers/adminController');

router.post('/assign-role', authenticate, requirePermission('manage:users'), assignRole);
router.get('/audit-logs', authenticate, requirePermission('view:audit_logs'), getAuditLogs);

module.exports = router;