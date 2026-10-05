const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const thanaController = require('../controllers/thanaController');

router.get('/', thanaController.getAll);
router.get('/search', thanaController.search);
router.get('/:id', thanaController.getById);
router.get('/district/:districtId', thanaController.getByDistrict);
router.post('/', authenticate, roleCheck('super_admin', 'admin'), thanaController.create);
router.put('/:id', authenticate, roleCheck('super_admin', 'admin'), thanaController.update);
router.delete('/:id', authenticate, roleCheck('super_admin', 'admin'), thanaController.remove);

module.exports = router;
