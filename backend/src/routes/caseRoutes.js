const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const caseController = require('../controllers/caseController');
const { createCaseValidation } = require('../validations/caseValidation');

router.post('/', authenticate, roleCheck('super_admin', 'admin', 'police_officer'), createCaseValidation, caseController.create);
router.get('/', caseController.getAll);
router.get('/search', caseController.search);
router.get('/status/:status', caseController.getByStatus);
router.get('/criminal/:criminalId', caseController.getByCriminal);
router.get('/thana/:thanaId', caseController.getByThana);
router.get('/court/:courtId', caseController.getByCourt);
router.get('/officer/:officerId', caseController.getByOfficer);
router.get('/:id', caseController.getById);
router.put('/:id', authenticate, roleCheck('super_admin', 'admin', 'police_officer', 'court_clerk'), caseController.update);
router.delete('/:id', authenticate, roleCheck('super_admin', 'admin'), caseController.remove);

module.exports = router;
