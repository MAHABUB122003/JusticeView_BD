const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const bailController = require('../controllers/bailController');

router.post('/', authenticate, roleCheck('super_admin', 'admin', 'court_clerk'), bailController.create);
router.get('/', bailController.getAll);
router.get('/search', bailController.search);
router.get('/criminal/:criminalId', bailController.getByCriminal);
router.get('/case/:caseId', bailController.getByCase);
router.get('/judge/:judgeId', bailController.getByJudge);
router.get('/lawyer/:lawyerId', bailController.getByLawyer);
router.get('/:id', bailController.getById);
router.put('/:id', authenticate, roleCheck('super_admin', 'admin', 'court_clerk'), bailController.update);

module.exports = router;
