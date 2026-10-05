const BailRecord = require('../models/BailRecord');
const Criminal = require('../models/Criminal');
const Judge = require('../models/Judge');
const { getPagination, getPaginationResponse, getSortOptions, buildSearchRegex } = require('../utils/helpers');

exports.create = async (req, res, next) => {
  try {
    const cleaned = { ...req.body };
    for (const key of ['lawyer', 'judge', 'hearingDate', 'nextHearingDate', 'notes', 'notes_bn', 'conditions']) {
      if (cleaned[key] === '' || cleaned[key] === null || cleaned[key] === undefined) {
        delete cleaned[key];
      }
    }
    const data = { ...cleaned, createdBy: req.user._id };

    const bailRecord = await BailRecord.create(data);

    await Criminal.findByIdAndUpdate(data.criminal, { $inc: { totalBails: 1 } });

    if (data.judge) {
      await Judge.findByIdAndUpdate(data.judge, { $inc: { totalBailsGranted: 1 } });
    }

    res.status(201).json({ success: true, message: 'Bail record created.', data: bailRecord });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSortOptions(req.query, '-bailDate');

    const [records, total] = await Promise.all([
      BailRecord.find()
        .populate('criminal', 'name name_bn nid photo')
        .populate('case', 'caseNumber')
        .populate('lawyer', 'name name_bn')
        .populate('judge', 'name name_bn')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      BailRecord.countDocuments(),
    ]);

    res.json({
      success: true,
      data: records,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getByCriminal = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [records, total] = await Promise.all([
      BailRecord.find({ criminal: req.params.criminalId })
        .populate('case', 'caseNumber')
        .populate('lawyer', 'name name_bn')
        .populate('judge', 'name name_bn')
        .sort('-bailDate')
        .skip(skip)
        .limit(limit),
      BailRecord.countDocuments({ criminal: req.params.criminalId }),
    ]);

    res.json({
      success: true,
      data: records,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getByCase = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [records, total] = await Promise.all([
      BailRecord.find({ case: req.params.caseId })
        .populate('criminal', 'name name_bn')
        .populate('lawyer', 'name name_bn')
        .populate('judge', 'name name_bn')
        .sort('-bailDate')
        .skip(skip)
        .limit(limit),
      BailRecord.countDocuments({ case: req.params.caseId }),
    ]);

    res.json({
      success: true,
      data: records,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getByJudge = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [records, total] = await Promise.all([
      BailRecord.find({ judge: req.params.judgeId })
        .populate('criminal', 'name name_bn')
        .populate('case', 'caseNumber')
        .populate('lawyer', 'name name_bn')
        .sort('-bailDate')
        .skip(skip)
        .limit(limit),
      BailRecord.countDocuments({ judge: req.params.judgeId }),
    ]);

    res.json({
      success: true,
      data: records,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getByLawyer = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [records, total] = await Promise.all([
      BailRecord.find({ lawyer: req.params.lawyerId })
        .populate('criminal', 'name name_bn')
        .populate('case', 'caseNumber')
        .populate('judge', 'name name_bn')
        .sort('-bailDate')
        .skip(skip)
        .limit(limit),
      BailRecord.countDocuments({ lawyer: req.params.lawyerId }),
    ]);

    res.json({
      success: true,
      data: records,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const record = await BailRecord.findById(req.params.id)
      .populate('criminal', 'name name_bn nid photo')
      .populate('case', 'caseNumber sectionLaw status')
      .populate('lawyer', 'name name_bn barCouncilNumber')
      .populate('judge', 'name name_bn designation');

    if (!record) {
      return res.status(404).json({ success: false, message: 'Bail record not found.' });
    }

    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const record = await BailRecord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Bail record not found.' });
    }
    res.json({ success: true, message: 'Bail record updated.', data: record });
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
    const records = await BailRecord.find({
      $or: [{ notes: regex }, { notes_bn: regex }],
    })
      .populate('criminal', 'name name_bn nid')
      .populate('case', 'caseNumber')
      .populate('judge', 'name name_bn')
      .limit(20);

    res.json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
};
