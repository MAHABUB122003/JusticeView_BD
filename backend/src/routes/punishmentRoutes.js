const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const punishmentController = require('../controllers/punishmentController');

router.post('/', authenticate, roleCheck('super_admin', 'admin', 'court_clerk'), punishmentController.create);
router.get('/', punishmentController.getAll);
router.get('/criminal/:criminalId', punishmentController.getByCriminal);
router.get('/:id', punishmentController.getById);
router.put('/:id', authenticate, roleCheck('super_admin', 'admin', 'court_clerk'), punishmentController.update);
router.put('/:id/release', authenticate, roleCheck('super_admin', 'admin', 'court_clerk'), punishmentController.release);

module.exports = router;
