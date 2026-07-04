const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const courtController = require('../controllers/courtController');

router.post('/', authenticate, roleCheck('super_admin', 'admin'), courtController.create);
router.get('/', courtController.getAll);
router.get('/district/:districtId', courtController.getByDistrict);
router.get('/:id', courtController.getById);
router.put('/:id', authenticate, roleCheck('super_admin', 'admin'), courtController.update);

module.exports = router;
