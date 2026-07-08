const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const chargeSheetController = require('../controllers/chargeSheetController');

router.post('/', authenticate, roleCheck('super_admin', 'admin', 'police_officer'), chargeSheetController.create);
router.get('/', chargeSheetController.getAll);
router.get('/case/:caseId', chargeSheetController.getByCase);
router.get('/:id', chargeSheetController.getById);
router.put('/:id', authenticate, roleCheck('super_admin', 'admin', 'police_officer'), chargeSheetController.update);
router.put('/:id/submit-to-court', authenticate, roleCheck('super_admin', 'admin', 'police_officer'), chargeSheetController.submitToCourt);

module.exports = router;
