const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

const createCriminalValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('nid').optional().isLength({ min: 10, max: 17 }).withMessage('NID must be 10-17 digits.').isNumeric().withMessage('NID must be numeric.'),
  body('fatherName').optional().trim(),
  body('motherName').optional().trim(),
  body('address').optional().trim(),
  body('dateOfBirth').optional().isISO8601().withMessage('Valid date is required.'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender.'),
  validate,
];

module.exports = { createCriminalValidation };
