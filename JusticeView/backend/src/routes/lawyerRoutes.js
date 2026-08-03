const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const lawyerController = require('../controllers/lawyerController');

router.post('/', authenticate, roleCheck('super_admin', 'admin', 'court_clerk'), lawyerController.create);
router.get('/', lawyerController.getAll);
router.get('/search', lawyerController.search);
router.get('/top-active', lawyerController.getTopActive);
router.get('/:id', lawyerController.getById);
router.put('/:id', authenticate, roleCheck('super_admin', 'admin', 'court_clerk'), lawyerController.update);

module.exports = router;
