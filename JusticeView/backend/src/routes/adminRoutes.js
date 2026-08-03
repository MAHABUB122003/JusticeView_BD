const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const adminController = require('../controllers/adminController');

router.get('/users', authenticate, roleCheck('super_admin', 'admin'), adminController.getUsers);
router.put('/users/:id/role', authenticate, roleCheck('super_admin'), adminController.updateUserRole);
router.put('/users/:id/status', authenticate, roleCheck('super_admin', 'admin'), adminController.updateUserStatus);
router.get('/audit-logs', authenticate, roleCheck('super_admin', 'admin'), adminController.getAuditLogs);
router.get('/system-stats', authenticate, roleCheck('super_admin', 'admin'), adminController.getSystemStats);
router.get('/settings', authenticate, roleCheck('super_admin', 'admin'), adminController.getSettings);
router.put('/settings', authenticate, roleCheck('super_admin', 'admin'), adminController.updateSettings);

module.exports = router;
