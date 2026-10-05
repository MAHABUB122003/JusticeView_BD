const Evidence = require('../models/Evidence');
const { getPagination, getPaginationResponse, getSortOptions } = require('../utils/helpers');

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, collectedBy: req.user._id };

    if (req.file) {
      data.evidenceUrl = `/uploads/evidence/${req.file.filename}`;
    }

    const evidence = await Evidence.create(data);
    res.status(201).json({ success: true, message: 'Evidence recorded.', data: evidence });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSortOptions(req.query, '-collectionDate');
    const { evidenceType, isSubmitted, case: caseId } = req.query;

    const filter = {};
    if (evidenceType) filter.evidenceType = evidenceType;
    if (isSubmitted !== undefined) filter.isSubmitted = isSubmitted === 'true';
    if (caseId) filter.case = caseId;

    const [evidence, total] = await Promise.all([
      Evidence.find(filter)
        .populate('case', 'caseNumber')
        .populate('collectedBy', 'name email')
        .populate('verifiedBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Evidence.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: evidence,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const evidence = await Evidence.findById(req.params.id)
      .populate('case', 'caseNumber')
      .populate('collectedBy', 'name email')
      .populate('verifiedBy', 'name email');

    if (!evidence) {
      return res.status(404).json({ success: false, message: 'Evidence not found.' });
    }

    res.json({ success: true, data: evidence });
  } catch (error) {
    next(error);
  }
};

exports.getByCase = async (req, res, next) => {
  try {
    const evidence = await Evidence.find({ case: req.params.caseId })
      .populate('collectedBy', 'name')
      .sort('-collectionDate');
    res.json({ success: true, data: evidence });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.evidenceUrl = `/uploads/evidence/${req.file.filename}`;
    }
    const evidence = await Evidence.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!evidence) {
      return res.status(404).json({ success: false, message: 'Evidence not found.' });
    }
    res.json({ success: true, message: 'Evidence updated.', data: evidence });
  } catch (error) {
    next(error);
  }
};

exports.submit = async (req, res, next) => {
  try {
    const evidence = await Evidence.findByIdAndUpdate(
      req.params.id,
      { isSubmitted: true, submittedDate: new Date() },
      { new: true }
    );
    if (!evidence) {
      return res.status(404).json({ success: false, message: 'Evidence not found.' });
    }
    res.json({ success: true, message: 'Evidence submitted to court.', data: evidence });
  } catch (error) {
    next(error);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const evidence = await Evidence.findByIdAndUpdate(
      req.params.id,
      { isVerified: true, verifiedBy: req.user._id },
      { new: true }
    );
    if (!evidence) {
      return res.status(404).json({ success: false, message: 'Evidence not found.' });
    }
    res.json({ success: true, message: 'Evidence verified.', data: evidence });
  } catch (error) {
    next(error);
  }
};
