const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const judgmentController = require('../controllers/judgmentController');

router.post('/', authenticate, roleCheck('super_admin', 'admin', 'court_clerk', 'judge'), judgmentController.create);
router.get('/', judgmentController.getAll);
router.get('/search', judgmentController.search);
router.get('/case/:caseId', judgmentController.getByCase);
router.get('/criminal/:criminalId', judgmentController.getByCriminal);
router.get('/:id', judgmentController.getById);
router.put('/:id', authenticate, roleCheck('super_admin', 'admin', 'court_clerk', 'judge'), judgmentController.update);

module.exports = router;
