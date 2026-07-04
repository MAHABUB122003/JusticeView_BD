const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const judgeController = require('../controllers/judgeController');

router.post('/', authenticate, roleCheck('super_admin', 'admin'), judgeController.create);
router.get('/', judgeController.getAll);
router.get('/top-bail', judgeController.getTopBail);
router.get('/court/:courtId', judgeController.getByCourt);
router.get('/:id', judgeController.getById);
router.put('/:id', authenticate, roleCheck('super_admin', 'admin'), judgeController.update);

module.exports = router;
