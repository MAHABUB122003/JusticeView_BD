const express = require('express');
const router = express.Router();
const divisionController = require('../controllers/divisionController');

router.get('/', divisionController.getAll);
router.get('/:id', divisionController.getById);

module.exports = router;
