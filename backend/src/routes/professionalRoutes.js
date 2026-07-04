const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const professionalController = require('../controllers/professionalController');
const {
  createProfessionalValidation,
  updateProfessionalValidation,
  createVerificationValidation,
} = require('../validations/professionalValidation');

router.post('/', optionalAuth, createProfessionalValidation, professionalController.create);
router.get('/', professionalController.getAll);
router.get('/search', professionalController.search);
router.get('/stats', professionalController.getStats);
router.get('/role/:role', professionalController.getByRole);
router.get('/verification-requests', authenticate, roleCheck('super_admin', 'admin'), professionalController.getVerificationRequests);
router.get('/:id', professionalController.getById);
router.put('/:id', authenticate, updateProfessionalValidation, professionalController.update);
router.post('/:id/photo', optionalAuth, require('../middleware/uploadProfessional').single('photo'), professionalController.uploadPhoto);
router.delete('/:id', authenticate, roleCheck('super_admin', 'admin'), professionalController.remove);

router.post('/verification', authenticate, createVerificationValidation, professionalController.submitVerification);
router.put('/verification/:id', authenticate, roleCheck('super_admin', 'admin'), professionalController.reviewVerification);

module.exports = router;
