const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

const createBailValidation = [
  body('case').isMongoId().withMessage('Valid case ID is required.'),
  body('criminal').isMongoId().withMessage('Valid criminal ID is required.'),
  body('bailDate').isISO8601().withMessage('Valid bail date is required.'),
  body('bailAmount').optional().isFloat({ min: 0 }).withMessage('Bail amount must be positive.'),
  body('conditions').optional().isArray(),
  body('hearingDate').optional({ values: 'falsy' }).isISO8601().withMessage('Invalid hearing date.'),
  body('nextHearingDate').optional({ values: 'falsy' }).isISO8601().withMessage('Invalid next hearing date.'),
  body('lawyer').optional({ values: 'falsy' }).isMongoId().withMessage('Invalid lawyer ID.'),
  body('judge').optional({ values: 'falsy' }).isMongoId().withMessage('Invalid judge ID.'),
  body('punishment').optional({ values: 'falsy' }).trim(),
  body('punishment_bn').optional({ values: 'falsy' }).trim(),
  validate,
];

module.exports = { createBailValidation };
