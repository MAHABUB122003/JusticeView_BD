const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const policeOfficerController = require('../controllers/policeOfficerController');

router.post('/', authenticate, roleCheck('super_admin', 'admin'), policeOfficerController.create);
router.get('/', policeOfficerController.getAll);
router.get('/search', policeOfficerController.search);
router.get('/thana/:thanaId', policeOfficerController.getByThana);
router.get('/:id', policeOfficerController.getById);
router.put('/:id', authenticate, policeOfficerController.update);
router.delete('/:id', authenticate, roleCheck('super_admin', 'admin'), policeOfficerController.remove);

module.exports = router;
