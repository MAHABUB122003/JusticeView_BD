const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { registerValidation, loginValidation } = require('../validations/authValidation');
const authController = require('../controllers/authController');

router.post('/register', authLimiter, registerValidation, authController.register);
router.post('/login', authLimiter, loginValidation, authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);
router.post('/refresh-token', authController.refreshToken);
router.put('/change-password', authenticate, authController.changePassword);
router.put('/update-profile', authenticate, authController.updateProfile);

module.exports = router;
