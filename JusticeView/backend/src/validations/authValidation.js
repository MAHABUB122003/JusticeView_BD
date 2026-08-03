const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').trim().isEmail().withMessage('Valid email is required.').normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain at least one number.'),
  body('phone').optional().trim(),
  validate,
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
  validate,
];

module.exports = { registerValidation, loginValidation };
