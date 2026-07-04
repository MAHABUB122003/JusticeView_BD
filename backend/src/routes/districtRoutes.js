const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const districtController = require('../controllers/districtController');

router.get('/', districtController.getAll);
router.get('/:id', districtController.getById);
router.get('/division/:divisionId', districtController.getByDivision);
router.post('/', authenticate, roleCheck('super_admin', 'admin'), districtController.create);
router.put('/:id', authenticate, roleCheck('super_admin', 'admin'), districtController.update);

module.exports = router;
