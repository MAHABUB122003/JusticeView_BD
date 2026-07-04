const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/dashboard', analyticsController.getDashboard);
router.get('/criminal-stats', analyticsController.getCriminalStats);
router.get('/case-trends', analyticsController.getCaseTrends);
router.get('/bail-trends', analyticsController.getBailTrends);
router.get('/district-wise', analyticsController.getDistrictWise);
router.get('/thana-wise', analyticsController.getThanaWise);
router.get('/top-lawyers', analyticsController.getTopLawyers);
router.get('/top-judges', analyticsController.getTopJudges);
router.get('/repeat-offenders', analyticsController.getRepeatOffenders);
router.get('/bail-success-rate', analyticsController.getBailSuccessRate);

module.exports = router;
