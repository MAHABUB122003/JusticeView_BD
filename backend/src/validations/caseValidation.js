const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

const createCaseValidation = [
  body('criminal').isMongoId().withMessage('Valid criminal ID is required.'),
  body('arrestingOfficer').trim().notEmpty().withMessage('Arresting officer ID or badge number is required.'),
  body('thana').trim().notEmpty().withMessage('Thana ID or name is required.'),
  body('court').optional({ values: 'falsy' }).isMongoId().withMessage('Valid court ID is required.'),
  body('arrestDate').isISO8601().withMessage('Valid arrest date is required.'),
  body('sectionLaw').optional().trim(),
  body('description').optional().trim(),
  validate,
];

module.exports = { createCaseValidation };
