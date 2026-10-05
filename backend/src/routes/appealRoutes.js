const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const appealController = require('../controllers/appealController');

router.post('/', authenticate, roleCheck('super_admin', 'admin', 'court_clerk', 'lawyer'), appealController.create);
router.get('/', appealController.getAll);
router.get('/:id', appealController.getById);
router.put('/:id', authenticate, roleCheck('super_admin', 'admin', 'court_clerk'), appealController.update);

module.exports = router;
