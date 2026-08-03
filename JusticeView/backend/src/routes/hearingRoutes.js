const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const hearingController = require('../controllers/hearingController');

router.post('/', authenticate, roleCheck('super_admin', 'admin', 'court_clerk'), hearingController.create);
router.get('/', hearingController.getAll);
router.get('/today', hearingController.getToday);
router.get('/case/:caseId', hearingController.getByCase);
router.get('/:id', hearingController.getById);
router.put('/:id', authenticate, roleCheck('super_admin', 'admin', 'court_clerk'), hearingController.update);

module.exports = router;
