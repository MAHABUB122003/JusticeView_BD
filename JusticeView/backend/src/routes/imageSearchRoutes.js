const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticate } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const imageSearchController = require('../controllers/imageSearchController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and WEBP images are allowed'), false);
    }
  },
});

// Public - search by image (no auth required)
router.post('/search-by-image', upload.single('image'), imageSearchController.searchByImage);

// Public - search by face descriptor (client-side detected, no upload needed)
router.post('/search-by-descriptor', imageSearchController.searchByDescriptor);

// Protected - match details
router.get('/match/:id', authenticate, imageSearchController.getMatchDetails);

// Protected - manage criminal faces
router.post('/criminal/:criminalId/face', authenticate, roleCheck('super_admin', 'admin', 'police_officer'), upload.single('image'), imageSearchController.addCriminalFace);

router.put('/face/:faceId', authenticate, roleCheck('super_admin', 'admin', 'police_officer'), upload.single('image'), imageSearchController.updateCriminalFace);

router.delete('/face/:faceId', authenticate, roleCheck('super_admin', 'admin'), imageSearchController.deleteCriminalFace);

router.get('/criminal/:criminalId/faces', authenticate, roleCheck('super_admin', 'admin', 'police_officer'), imageSearchController.getCriminalFaces);

module.exports = router;
