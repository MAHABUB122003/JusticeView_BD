const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const evidenceController = require('../controllers/evidenceController');
const upload = require('../middleware/upload');

router.post('/', authenticate, roleCheck('super_admin', 'admin', 'police_officer'), upload.single('evidenceFile'), evidenceController.create);
router.get('/', evidenceController.getAll);
router.get('/case/:caseId', evidenceController.getByCase);
router.get('/:id', evidenceController.getById);
router.put('/:id', authenticate, roleCheck('super_admin', 'admin', 'police_officer'), upload.single('evidenceFile'), evidenceController.update);
router.put('/:id/submit', authenticate, roleCheck('super_admin', 'admin', 'police_officer', 'court_clerk'), evidenceController.submit);
router.put('/:id/verify', authenticate, roleCheck('super_admin', 'admin', 'court_clerk', 'judge'), evidenceController.verify);

module.exports = router;
