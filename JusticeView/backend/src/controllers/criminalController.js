const Criminal = require('../models/Criminal');
const { getPagination, getPaginationResponse, getSortOptions, buildSearchRegex } = require('../utils/helpers');

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, createdBy: req.user._id };

    if (req.file) {
      data.photo = `/uploads/criminals/${req.file.filename}`;
    }

    const criminal = await Criminal.create(data);
    res.status(201).json({ success: true, message: 'Criminal record created.', data: criminal });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSortOptions(req.query, '-createdAt');
    const { district, gender, isRepeatOffender } = req.query;

    const filter = {};
    if (district) filter.district = district;
    if (gender) filter.gender = gender;
    if (isRepeatOffender !== undefined) filter.isRepeatOffender = isRepeatOffender === 'true';

    const [criminals, total] = await Promise.all([
      Criminal.find(filter).populate('district', 'name name_bn').sort(sort).skip(skip).limit(limit),
      Criminal.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: criminals,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { q, nid } = req.query;
    const { page, limit, skip } = getPagination(req.query);

    const filter = {};
    if (q) {
      const regex = buildSearchRegex(q);
      filter.$or = [{ name: regex }, { name_bn: regex }, { nid: regex }, { fatherName: regex }];
      if (q.match(/^[0-9a-fA-F]{24}$/)) {
        filter.$or.push({ _id: q });
      }
    }
    if (nid) filter.nid = nid;

    const [criminals, total] = await Promise.all([
      Criminal.find(filter).populate('district', 'name name_bn').sort('-createdAt').skip(skip).limit(limit),
      Criminal.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: criminals,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const criminal = await Criminal.findById(req.params.id)
      .populate('district', 'name name_bn')
      .populate({
        path: 'cases',
        populate: [
          { path: 'thana', select: 'name name_bn' },
          { path: 'arrestingOfficer', select: 'name badgeNumber' },
          { path: 'court', select: 'name name_bn' },
        ],
      })
      .populate({
        path: 'bailRecords',
        populate: [
          { path: 'case', select: 'caseNumber' },
          { path: 'lawyer', select: 'name name_bn' },
          { path: 'judge', select: 'name name_bn' },
        ],
      });

    if (!criminal) {
      return res.status(404).json({ success: false, message: 'Criminal not found.' });
    }

    res.json({ success: true, data: criminal });
  } catch (error) {
    next(error);
  }
};

exports.getByNid = async (req, res, next) => {
  try {
    const criminal = await Criminal.findOne({ nid: req.params.nid })
      .populate('district', 'name name_bn')
      .populate('cases');
    if (!criminal) {
      return res.status(404).json({ success: false, message: 'Criminal not found.' });
    }
    res.json({ success: true, data: criminal });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.photo = `/uploads/criminals/${req.file.filename}`;
    }

    const criminal = await Criminal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!criminal) {
      return res.status(404).json({ success: false, message: 'Criminal not found.' });
    }
    res.json({ success: true, message: 'Criminal updated.', data: criminal });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const criminal = await Criminal.findByIdAndDelete(req.params.id);
    if (!criminal) {
      return res.status(404).json({ success: false, message: 'Criminal not found.' });
    }
    res.json({ success: true, message: 'Criminal deleted.' });
  } catch (error) {
    next(error);
  }
};

exports.uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const criminal = await Criminal.findByIdAndUpdate(
      req.params.id,
      { photo: `/uploads/criminals/${req.file.filename}` },
      { new: true }
    );

    if (!criminal) {
      return res.status(404).json({ success: false, message: 'Criminal not found.' });
    }

    res.json({ success: true, message: 'Photo uploaded.', data: criminal });
  } catch (error) {
    next(error);
  }
};

exports.getRepeatOffenders = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [criminals, total] = await Promise.all([
      Criminal.find({ isRepeatOffender: true })
        .populate('district', 'name name_bn')
        .sort('-totalCases')
        .skip(skip)
        .limit(limit),
      Criminal.countDocuments({ isRepeatOffender: true }),
    ]);

    res.json({
      success: true,
      data: criminals,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};
