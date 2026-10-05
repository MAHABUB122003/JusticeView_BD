const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const upload = require('../middleware/upload');
const criminalController = require('../controllers/criminalController');

router.post('/', authenticate, roleCheck('super_admin', 'admin', 'police_officer'), upload.single('photo'), criminalController.create);
router.get('/', criminalController.getAll);
router.get('/search', criminalController.search);
router.get('/repeat-offenders', criminalController.getRepeatOffenders);
router.get('/nid/:nid', criminalController.getByNid);
router.get('/:id', criminalController.getById);
router.put('/:id', authenticate, roleCheck('super_admin', 'admin', 'police_officer'), upload.single('photo'), criminalController.update);
router.delete('/:id', authenticate, roleCheck('super_admin', 'admin'), criminalController.remove);
router.post('/:id/photo', authenticate, roleCheck('super_admin', 'admin', 'police_officer'), upload.single('photo'), criminalController.uploadPhoto);

module.exports = router;
