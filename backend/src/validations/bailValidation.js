const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

const createBailValidation = [
  body('case').isMongoId().withMessage('Valid case ID is required.'),
  body('criminal').isMongoId().withMessage('Valid criminal ID is required.'),
  body('bailDate').isISO8601().withMessage('Valid bail date is required.'),
  body('bailAmount').optional().isFloat({ min: 0 }).withMessage('Bail amount must be positive.'),
  body('conditions').optional().isArray(),
  body('hearingDate').optional().isISO8601(),
  validate,
];

module.exports = { createBailValidation };
