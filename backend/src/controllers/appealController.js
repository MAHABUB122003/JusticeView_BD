const Appeal = require('../models/Appeal');
const { getPagination, getPaginationResponse, getSortOptions } = require('../utils/helpers');

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const appeal = await Appeal.create(data);
    res.status(201).json({ success: true, message: 'Appeal filed.', data: appeal });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSortOptions(req.query, '-filingDate');
    const { appealStatus, appealType } = req.query;

    const filter = {};
    if (appealStatus) filter.appealStatus = appealStatus;
    if (appealType) filter.appealType = appealType;

    const [appeals, total] = await Promise.all([
      Appeal.find(filter)
        .populate('criminal', 'name name_bn nid photo')
        .populate('case', 'caseNumber')
        .populate('judgment', 'judgmentId verdictStatus')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Appeal.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: appeals,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const appeal = await Appeal.findById(req.params.id)
      .populate('criminal', 'name name_bn nid photo')
      .populate('case', 'caseNumber')
      .populate('judgment', 'judgmentId verdictStatus judgmentDate')
      .populate('appellantLawyer', 'name email')
      .populate('respondentLawyer', 'name email');

    if (!appeal) {
      return res.status(404).json({ success: false, message: 'Appeal not found.' });
    }

    res.json({ success: true, data: appeal });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const appeal = await Appeal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!appeal) {
      return res.status(404).json({ success: false, message: 'Appeal not found.' });
    }
    res.json({ success: true, message: 'Appeal updated.', data: appeal });
  } catch (error) {
    next(error);
  }
};
