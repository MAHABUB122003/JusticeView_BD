const Lawyer = require('../models/Lawyer');
const { getPagination, getPaginationResponse, buildSearchRegex } = require('../utils/helpers');

exports.create = async (req, res, next) => {
  try {
    const lawyer = await Lawyer.create(req.body);
    res.status(201).json({ success: true, message: 'Lawyer created.', data: lawyer });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { district } = req.query;

    const filter = {};
    if (district) filter.district = district;

    const [lawyers, total] = await Promise.all([
      Lawyer.find(filter).populate('district', 'name name_bn').sort('-createdAt').skip(skip).limit(limit),
      Lawyer.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: lawyers,
      pagination: getPaginationResponse(total, page, limit),
    });
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
    const lawyers = await Lawyer.find({
      $or: [{ name: regex }, { name_bn: regex }, { barCouncilNumber: regex }],
    }).populate('district', 'name name_bn').limit(20);

    res.json({ success: true, data: lawyers });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id)
      .populate('district', 'name name_bn')
      .populate({
        path: 'bailRecords',
        populate: [
          { path: 'case', select: 'caseNumber' },
          { path: 'criminal', select: 'name name_bn' },
          { path: 'judge', select: 'name name_bn' },
        ],
      });

    if (!lawyer) {
      return res.status(404).json({ success: false, message: 'Lawyer not found.' });
    }

    res.json({ success: true, data: lawyer });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const lawyer = await Lawyer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lawyer) {
      return res.status(404).json({ success: false, message: 'Lawyer not found.' });
    }
    res.json({ success: true, message: 'Lawyer updated.', data: lawyer });
  } catch (error) {
    next(error);
  }
};

exports.getTopActive = async (req, res, next) => {
  try {
    const lawyers = await Lawyer.find({ isActive: true })
      .sort({ totalCases: -1 })
      .limit(10)
      .populate('district', 'name name_bn');

    res.json({ success: true, data: lawyers });
  } catch (error) {
    next(error);
  }
};
