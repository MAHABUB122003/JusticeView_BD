const ProfessionalRegistry = require('../models/ProfessionalRegistry');
const ProfessionalVerificationRequest = require('../models/ProfessionalVerificationRequest');
const ProfessionalCaseHistory = require('../models/ProfessionalCaseHistory');
const { getPagination, getPaginationResponse, buildSearchRegex } = require('../utils/helpers');

const stripEmpty = (obj) => {
  const cleaned = { ...obj };
  Object.keys(cleaned).forEach(k => {
    if (cleaned[k] === '' || cleaned[k] === null) {
      delete cleaned[k];
    }
    if (Array.isArray(cleaned[k]) && cleaned[k].length === 0) {
      delete cleaned[k];
    }
  });
  return cleaned;
};

exports.create = async (req, res, next) => {
  try {
    const professional = await ProfessionalRegistry.create({
      ...stripEmpty(req.body),
      createdBy: req.user?._id,
    });
    res.status(201).json({ success: true, message: 'Professional registered.', data: professional });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { role, district, thana, verification_status, is_active, specialization } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (district) filter['current_location.district'] = district;
    if (thana) filter['current_location.thana'] = thana;
    if (verification_status) filter.verification_status = verification_status;
    if (is_active !== undefined) filter.is_active = is_active === 'true';
    if (specialization) filter.specialization = { $in: [specialization] };

    const [professionals, total] = await Promise.all([
      ProfessionalRegistry.find(filter)
        .populate('current_location.district', 'name name_bn')
        .populate('current_location.thana', 'name name_bn')
        .populate('current_location.court', 'name name_bn')
        .populate('thana', 'name name_bn')
        .populate('court', 'name name_bn')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      ProfessionalRegistry.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: professionals,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { q, role } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query required.' });
    }

    const regex = buildSearchRegex(q);
    const conditions = [
      { name: regex },
      { bn_name: regex },
      { badge_no: regex },
      { bar_council_no: regex },
      { email: regex },
      { phone: regex },
      { nid: regex },
    ];

    if (role) {
      conditions.forEach(c => { c.role = role; });
    }

    const professionals = await ProfessionalRegistry.find({ $or: conditions })
      .populate('current_location.district', 'name name_bn')
      .populate('current_location.thana', 'name name_bn')
      .limit(20);

    res.json({ success: true, data: professionals });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const professional = await ProfessionalRegistry.findById(req.params.id)
      .populate('current_location.district', 'name name_bn')
      .populate('current_location.thana', 'name name_bn')
      .populate('current_location.court', 'name name_bn')
      .populate('thana', 'name name_bn')
      .populate('court', 'name name_bn')
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email');

    if (!professional) {
      return res.status(404).json({ success: false, message: 'Professional not found.' });
    }

    const caseHistories = await ProfessionalCaseHistory.find({ professional: professional._id })
      .populate('case', 'caseNumber sectionLaw status')
      .sort('-date');

    res.json({
      success: true,
      data: {
        ...professional.toObject(),
        caseHistories,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getByRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    const { page, limit, skip } = getPagination(req.query);

    if (!['police_officer', 'lawyer', 'magistrate', 'judge', 'court_official'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }

    const [professionals, total] = await Promise.all([
      ProfessionalRegistry.find({ role, is_active: true })
        .populate('current_location.district', 'name name_bn')
        .populate('current_location.thana', 'name name_bn')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      ProfessionalRegistry.countDocuments({ role, is_active: true }),
    ]);

    res.json({
      success: true,
      data: professionals,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const professional = await ProfessionalRegistry.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!professional) {
      return res.status(404).json({ success: false, message: 'Professional not found.' });
    }
    res.json({ success: true, message: 'Professional updated.', data: professional });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const professional = await ProfessionalRegistry.findByIdAndDelete(req.params.id);
    if (!professional) {
      return res.status(404).json({ success: false, message: 'Professional not found.' });
    }
    await Promise.all([
      ProfessionalVerificationRequest.deleteMany({ professional: professional._id }),
      ProfessionalCaseHistory.deleteMany({ professional: professional._id }),
    ]);
    res.json({ success: true, message: 'Professional deleted.' });
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const stats = await ProfessionalRegistry.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          verified: { $sum: { $cond: [{ $eq: ['$is_verified', true] }, 1, 0] } },
        },
      },
    ]);

    const total = stats.reduce((acc, s) => acc + s.count, 0);
    const result = { total };
    stats.forEach(s => { result[s._id] = { count: s.count, verified: s.verified }; });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

exports.uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No photo uploaded.' });
    }
    const photoPath = '/uploads/professionals/' + req.file.filename;
    const professional = await ProfessionalRegistry.findByIdAndUpdate(
      req.params.id,
      { photo: photoPath, updatedAt: Date.now() },
      { new: true }
    );
    if (!professional) {
      return res.status(404).json({ success: false, message: 'Professional not found.' });
    }
    res.json({ success: true, message: 'Photo uploaded.', data: { photo: photoPath } });
  } catch (error) {
    next(error);
  }
};

exports.submitVerification = async (req, res, next) => {
  try {
    const { professional, verification_documents } = req.body;
    const existing = await ProfessionalRegistry.findById(professional);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Professional not found.' });
    }

    const request = await ProfessionalVerificationRequest.create({
      professional,
      verification_documents,
      submitted_by: req.user?._id,
    });

    res.status(201).json({ success: true, message: 'Verification request submitted.', data: request });
  } catch (error) {
    next(error);
  }
};

exports.reviewVerification = async (req, res, next) => {
  try {
    const { status, review_notes } = req.body;
    const request = await ProfessionalVerificationRequest.findByIdAndUpdate(
      req.params.id,
      {
        status,
        review_notes,
        reviewed_by: req.user?._id,
        reviewed_at: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: 'Verification request not found.' });
    }

    if (status === 'approved') {
      await ProfessionalRegistry.findByIdAndUpdate(request.professional, {
        is_verified: true,
        verification_status: 'verified',
        approvedBy: req.user?._id,
      });
    } else if (status === 'rejected') {
      await ProfessionalRegistry.findByIdAndUpdate(request.professional, {
        verification_status: 'rejected',
      });
    }

    res.json({ success: true, message: `Verification ${status}.`, data: request });
  } catch (error) {
    next(error);
  }
};

exports.getVerificationRequests = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const [requests, total] = await Promise.all([
      ProfessionalVerificationRequest.find(filter)
        .populate('professional', 'name bn_name role email phone')
        .populate('submitted_by', 'name email')
        .populate('reviewed_by', 'name email')
        .sort('-submitted_at')
        .skip(skip)
        .limit(limit),
      ProfessionalVerificationRequest.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: requests,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};
