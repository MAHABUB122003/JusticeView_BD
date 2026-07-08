const ChargeSheet = require('../models/ChargeSheet');
const Case = require('../models/Case');
const { getPagination, getPaginationResponse, getSortOptions } = require('../utils/helpers');

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, investigatingOfficer: req.user._id };

    const chargeSheet = await ChargeSheet.create(data);

    await Case.findByIdAndUpdate(data.case, { status: 'trial', caseStatus: 'under_trial' });

    res.status(201).json({ success: true, message: 'Charge sheet submitted.', data: chargeSheet });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSortOptions(req.query, '-submittedDate');
    const { judgeAcceptance, case: caseId } = req.query;

    const filter = {};
    if (judgeAcceptance) filter.judgeAcceptance = judgeAcceptance;
    if (caseId) filter.case = caseId;

    const [chargeSheets, total] = await Promise.all([
      ChargeSheet.find(filter)
        .populate('criminal', 'name name_bn nid photo')
        .populate('case', 'caseNumber sectionLaw')
        .populate('investigatingOfficer', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      ChargeSheet.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: chargeSheets,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const chargeSheet = await ChargeSheet.findById(req.params.id)
      .populate('criminal', 'name name_bn nid photo')
      .populate('case', 'caseNumber sectionLaw lawAct')
      .populate('investigatingOfficer', 'name email designation');

    if (!chargeSheet) {
      return res.status(404).json({ success: false, message: 'Charge sheet not found.' });
    }

    res.json({ success: true, data: chargeSheet });
  } catch (error) {
    next(error);
  }
};

exports.getByCase = async (req, res, next) => {
  try {
    const chargeSheets = await ChargeSheet.find({ case: req.params.caseId })
      .populate('investigatingOfficer', 'name')
      .sort('-submittedDate');
    res.json({ success: true, data: chargeSheets });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const chargeSheet = await ChargeSheet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!chargeSheet) {
      return res.status(404).json({ success: false, message: 'Charge sheet not found.' });
    }

    if (req.body.judgeAcceptance === 'accepted') {
      await Case.findByIdAndUpdate(chargeSheet.case, { status: 'trial', caseStatus: 'under_trial' });
    }

    res.json({ success: true, message: 'Charge sheet updated.', data: chargeSheet });
  } catch (error) {
    next(error);
  }
};

exports.submitToCourt = async (req, res, next) => {
  try {
    const chargeSheet = await ChargeSheet.findByIdAndUpdate(
      req.params.id,
      { submittedToCourt: true, submissionDateToCourt: new Date() },
      { new: true }
    );
    if (!chargeSheet) {
      return res.status(404).json({ success: false, message: 'Charge sheet not found.' });
    }
    res.json({ success: true, message: 'Charge sheet submitted to court.', data: chargeSheet });
  } catch (error) {
    next(error);
  }
};
