const Hearing = require('../models/Hearing');
const Case = require('../models/Case');
const { getPagination, getPaginationResponse, getSortOptions } = require('../utils/helpers');

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };

    const hearing = await Hearing.create(data);

    if (data.nextHearingDate) {
      await Case.findByIdAndUpdate(data.case, { nextHearingDate: data.nextHearingDate });
    }

    res.status(201).json({ success: true, message: 'Hearing scheduled.', data: hearing });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSortOptions(req.query, 'hearingDate');
    const { hearingStatus, judge, case: caseId } = req.query;

    const filter = {};
    if (hearingStatus) filter.hearingStatus = hearingStatus;
    if (judge) filter.judge = judge;
    if (caseId) filter.case = caseId;

    const [hearings, total] = await Promise.all([
      Hearing.find(filter)
        .populate('case', 'caseNumber')
        .populate('judge', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Hearing.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: hearings,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const hearing = await Hearing.findById(req.params.id)
      .populate('case', 'caseNumber criminal')
      .populate('judge', 'name email designation');

    if (!hearing) {
      return res.status(404).json({ success: false, message: 'Hearing not found.' });
    }

    res.json({ success: true, data: hearing });
  } catch (error) {
    next(error);
  }
};

exports.getByCase = async (req, res, next) => {
  try {
    const hearings = await Hearing.find({ case: req.params.caseId })
      .populate('judge', 'name')
      .sort({ hearingDate: -1 });
    res.json({ success: true, data: hearings });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const hearing = await Hearing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hearing) {
      return res.status(404).json({ success: false, message: 'Hearing not found.' });
    }

    if (req.body.nextHearingDate) {
      await Case.findByIdAndUpdate(hearing.case, { nextHearingDate: req.body.nextHearingDate });
    }

    res.json({ success: true, message: 'Hearing updated.', data: hearing });
  } catch (error) {
    next(error);
  }
};

exports.getToday = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const hearings = await Hearing.find({
      hearingDate: { $gte: today, $lt: tomorrow },
      hearingStatus: { $ne: 'cancelled' },
    })
      .populate('case', 'caseNumber')
      .populate('judge', 'name')
      .sort({ hearingTime: 1 });

    res.json({ success: true, data: hearings });
  } catch (error) {
    next(error);
  }
};
