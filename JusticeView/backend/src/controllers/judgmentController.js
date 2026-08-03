const Judgment = require('../models/Judgment');
const Case = require('../models/Case');
const Criminal = require('../models/Criminal');
const Punishment = require('../models/Punishment');
const { getPagination, getPaginationResponse, getSortOptions, buildSearchRegex } = require('../utils/helpers');

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, createdBy: req.user._id };
    if (!data.judge) data.judge = req.user._id;

    const judgment = await Judgment.create(data);

    await Case.findByIdAndUpdate(data.case, { caseStatus: 'disposed', status: 'disposed' });
    if (data.verdictStatus === 'guilty' || data.verdictStatus === 'sentenced') {
      await Criminal.findByIdAndUpdate(data.criminal, { $inc: { totalConvictions: 1 } });
    }

    res.status(201).json({ success: true, message: 'Judgment recorded.', data: judgment });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSortOptions(req.query, '-judgmentDate');
    const { verdictStatus, judge } = req.query;

    const filter = {};
    if (verdictStatus) filter.verdictStatus = verdictStatus;
    if (judge) filter.judge = judge;

    const [judgments, total] = await Promise.all([
      Judgment.find(filter)
        .populate('criminal', 'name name_bn nid photo')
        .populate('case', 'caseNumber sectionLaw')
        .populate('judge', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Judgment.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: judgments,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const judgment = await Judgment.findById(req.params.id)
      .populate('criminal', 'name name_bn nid photo fatherName motherName')
      .populate('case', 'caseNumber sectionLaw lawAct lawSection status')
      .populate('judge', 'name email designation')
      .populate({
        path: 'punishments',
        populate: { path: 'criminal', select: 'name name_bn' },
      });

    if (!judgment) {
      return res.status(404).json({ success: false, message: 'Judgment not found.' });
    }

    res.json({ success: true, data: judgment });
  } catch (error) {
    next(error);
  }
};

exports.getByCase = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [judgments, total] = await Promise.all([
      Judgment.find({ case: req.params.caseId })
        .populate('criminal', 'name name_bn nid')
        .populate('judge', 'name')
        .sort('-judgmentDate')
        .skip(skip)
        .limit(limit),
      Judgment.countDocuments({ case: req.params.caseId }),
    ]);

    res.json({ success: true, data: judgments, pagination: getPaginationResponse(total, page, limit) });
  } catch (error) {
    next(error);
  }
};

exports.getByCriminal = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [judgments, total] = await Promise.all([
      Judgment.find({ criminal: req.params.criminalId })
        .populate('case', 'caseNumber')
        .populate('judge', 'name')
        .sort('-judgmentDate')
        .skip(skip)
        .limit(limit),
      Judgment.countDocuments({ criminal: req.params.criminalId }),
    ]);

    res.json({ success: true, data: judgments, pagination: getPaginationResponse(total, page, limit) });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const judgment = await Judgment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!judgment) {
      return res.status(404).json({ success: false, message: 'Judgment not found.' });
    }
    res.json({ success: true, message: 'Judgment updated.', data: judgment });
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query required.' });
    }
    const regex = buildSearchRegex(q);
    const judgments = await Judgment.find({
      $or: [{ judgmentSummaryEnglish: regex }, { judgmentSummaryBangla: regex }, { keyPoints: regex }],
    })
      .populate('criminal', 'name name_bn nid')
      .populate('case', 'caseNumber')
      .limit(20);

    res.json({ success: true, data: judgments });
  } catch (error) {
    next(error);
  }
};
