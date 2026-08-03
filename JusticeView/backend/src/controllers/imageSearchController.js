const faceRecognitionService = require('../services/faceRecognitionService');
const Criminal = require('../models/Criminal');

exports.searchByImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    const limit = parseInt(req.query.limit) || 10;
    const threshold = parseFloat(req.query.threshold) || 0.6;

    const result = await faceRecognitionService.searchByImage(req.file.buffer, limit, threshold);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    const matchesWithDetails = result.matches.map(match => ({
      face_id: match.face_id,
      similarity: match.similarity,
      similarity_level: match.similarity >= 80 ? 'high' : match.similarity >= 60 ? 'medium' : 'low',
      criminal: match.criminal
        ? {
            _id: match.criminal._id,
            name: match.criminal.name,
            name_bn: match.criminal.name_bn,
            nid: match.criminal.nid,
            photo: match.criminal.photo,
            fatherName: match.criminal.fatherName,
            motherName: match.criminal.motherName,
            gender: match.criminal.gender,
            dateOfBirth: match.criminal.dateOfBirth,
            address: match.criminal.address,
            totalCases: match.criminal.totalCases,
            totalBails: match.criminal.totalBails,
            isRepeatOffender: match.criminal.isRepeatOffender,
            createdAt: match.criminal.createdAt,
          }
        : null,
    }));

    res.json({
      success: true,
      message: result.message,
      data: {
        matches: matchesWithDetails,
        total_matches: matchesWithDetails.length,
        search_metadata: {
          face_confidence: result.uploaded_face?.confidence,
          has_landmarks: result.uploaded_face?.has_landmarks,
          threshold_used: threshold,
          limit_used: limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMatchDetails = async (req, res, next) => {
  try {
    const CriminalFace = require('../models/CriminalFace');
    const faceMatch = await CriminalFace.findById(req.params.id)
      .populate({
        path: 'criminal',
        select: '-__v',
      });

    if (!faceMatch) {
      return res.status(404).json({ success: false, message: 'Face match not found' });
    }

    res.json({ success: true, data: faceMatch });
  } catch (error) {
    next(error);
  }
};

exports.addCriminalFace = async (req, res, next) => {
  try {
    const { criminalId } = req.params;
    const { isPrimary } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    const criminal = await Criminal.findById(criminalId);
    if (!criminal) {
      return res.status(404).json({ success: false, message: 'Criminal not found' });
    }

    const result = await faceRecognitionService.addCriminalFace(
      criminalId,
      req.file.buffer,
      isPrimary || false,
    );

    res.status(201).json({ success: true, message: 'Face added successfully', data: result.criminalFace });
  } catch (error) {
    next(error);
  }
};

exports.updateCriminalFace = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    const result = await faceRecognitionService.updateCriminalFace(req.params.faceId, req.file.buffer);
    res.json({ success: true, message: 'Face updated successfully', data: result.criminalFace });
  } catch (error) {
    next(error);
  }
};

exports.deleteCriminalFace = async (req, res, next) => {
  try {
    const result = await faceRecognitionService.deleteCriminalFace(req.params.faceId);
    res.json({ success: true, message: 'Face deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getCriminalFaces = async (req, res, next) => {
  try {
    const faces = await faceRecognitionService.getCriminalFaces(req.params.criminalId);
    res.json({ success: true, data: faces });
  } catch (error) {
    next(error);
  }
};

exports.searchByDescriptor = async (req, res, next) => {
  try {
    const { descriptor, threshold = 0.6 } = req.body;
    if (!descriptor || !Array.isArray(descriptor)) {
      return res.status(400).json({ success: false, message: 'Face descriptor array required' });
    }
    const matches = await faceRecognitionService.searchByDescriptor(
      Object.values(descriptor),
      10,
      threshold
    );
    res.json({ success: true, data: { matches } });
  } catch (error) {
    next(error);
  }
};
