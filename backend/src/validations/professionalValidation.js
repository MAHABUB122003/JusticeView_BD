const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

const createProfessionalValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('bn_name').trim().notEmpty().withMessage('Bengali name is required.'),
  body('role')
    .isIn(['police_officer', 'lawyer', 'magistrate', 'judge', 'court_official'])
    .withMessage('Valid role is required.'),
  body('email').isEmail().withMessage('Valid email is required.'),
  body('phone').trim().notEmpty().withMessage('Phone number is required.'),
  body('gender').optional().isIn(['Male', 'Female', 'Other']).withMessage('Valid gender is required.'),
  body('badge_no').if(body('role').equals('police_officer')).trim().notEmpty().withMessage('Badge number is required for police officers.'),
  body('rank').if(body('role').equals('police_officer')).trim().notEmpty().withMessage('Rank is required for police officers.'),
  body('bar_council_no').if(body('role').equals('lawyer')).trim().notEmpty().withMessage('Bar council number is required for lawyers.'),
  body('lawyer_type').if(body('role').equals('lawyer')).isIn(['government', 'private', 'both']).withMessage('Valid lawyer type is required.'),
  body('judge_type').if(body('role').equals('judge')).trim().notEmpty().withMessage('Judge type is required.'),
  body('magistrate_type').if(body('role').equals('magistrate')).trim().notEmpty().withMessage('Magistrate type is required.'),
  body('nid').optional().trim().notEmpty(),
  validate,
];

const updateProfessionalValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty.'),
  body('bn_name').optional().trim().notEmpty().withMessage('Bengali name cannot be empty.'),
  body('email').optional().isEmail().withMessage('Valid email is required.'),
  body('phone').optional().trim().notEmpty().withMessage('Phone number cannot be empty.'),
  body('gender').optional().isIn(['Male', 'Female', 'Other']).withMessage('Valid gender is required.'),
  validate,
];

const createVerificationValidation = [
  body('professional').isMongoId().withMessage('Valid professional ID is required.'),
  validate,
];

module.exports = {
  createProfessionalValidation,
  updateProfessionalValidation,
  createVerificationValidation,
};
