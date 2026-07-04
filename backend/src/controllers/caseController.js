const mongoose = require('mongoose');
const Case = require('../models/Case');
const Criminal = require('../models/Criminal');
const PoliceOfficer = require('../models/PoliceOfficer');
const Thana = require('../models/Thana');
const { getPagination, getPaginationResponse, getSortOptions, buildSearchRegex } = require('../utils/helpers');

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, createdBy: req.user._id };

    if (data.criminal) {
      const criminalExists = await Criminal.findById(data.criminal);
      if (!criminalExists) {
        return res.status(400).json({ success: false, message: 'Invalid Criminal ID. No criminal found with this ID.' });
      }
    }

    // Look up arresting officer by ObjectId or badge number
    if (data.arrestingOfficer) {
      if (mongoose.Types.ObjectId.isValid(data.arrestingOfficer)) {
        const officer = await PoliceOfficer.findById(data.arrestingOfficer);
        if (!officer) {
          return res.status(400).json({ success: false, message: 'Invalid arresting officer ID. No officer found with this ID.' });
        }
      } else {
        const officer = await PoliceOfficer.findOne({ badgeNumber: data.arrestingOfficer });
        if (!officer) {
          return res.status(400).json({ success: false, message: `No police officer found with badge number "${data.arrestingOfficer}".` });
        }
        data.arrestingOfficer = officer._id;
      }
    }

    // Look up thana by ObjectId or name
    if (data.thana) {
      if (mongoose.Types.ObjectId.isValid(data.thana)) {
        const thana = await Thana.findById(data.thana);
        if (!thana) {
          return res.status(400).json({ success: false, message: 'Invalid thana ID. No thana found with this ID.' });
        }
      } else {
        const thana = await Thana.findOne({
          $or: [{ name: new RegExp(`^${data.thana.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
                 { name_bn: data.thana }]
        });
        if (!thana) {
          return res.status(400).json({ success: false, message: `No thana found with name "${data.thana}".` });
        }
        data.thana = thana._id;
      }
    }

    let thanaId = data.thana;
    if (!thanaId && req.user.thana) {
      thanaId = req.user.thana;
      data.thana = thanaId;
    }

    const caseRecord = await Case.create(data);

    await Criminal.findByIdAndUpdate(data.criminal, { $inc: { totalCases: 1 } });

    res.status(201).json({ success: true, message: 'Case created.', data: caseRecord });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSortOptions(req.query, '-arrestDate');
    const { status, priority, thana, court } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (thana) filter.thana = thana;
    if (court) filter.court = court;

    const [cases, total] = await Promise.all([
      Case.find(filter)
        .populate('criminal', 'name name_bn nid photo')
        .populate('arrestingOfficer', 'name badgeNumber')
        .populate('thana', 'name name_bn')
        .populate('court', 'name name_bn')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Case.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: cases,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const caseRecord = await Case.findById(req.params.id)
      .populate('criminal', 'name name_bn nid photo fatherName motherName')
      .populate('arrestingOfficer', 'name badgeNumber designation phone')
      .populate('thana', 'name name_bn phone')
      .populate('court', 'name name_bn address')
      .populate({
        path: 'bailRecords',
        populate: [
          { path: 'lawyer', select: 'name name_bn barCouncilNumber' },
          { path: 'judge', select: 'name name_bn designation' },
        ],
      });

    if (!caseRecord) {
      return res.status(404).json({ success: false, message: 'Case not found.' });
    }

    res.json({ success: true, data: caseRecord });
  } catch (error) {
    next(error);
  }
};

exports.getByCriminal = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [cases, total] = await Promise.all([
      Case.find({ criminal: req.params.criminalId })
        .populate('criminal', 'name name_bn nid photo')
        .populate('arrestingOfficer', 'name badgeNumber')
        .populate('thana', 'name name_bn')
        .populate('court', 'name name_bn')
        .sort('-arrestDate')
        .skip(skip)
        .limit(limit),
      Case.countDocuments({ criminal: req.params.criminalId }),
    ]);

    res.json({
      success: true,
      data: cases,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getByThana = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [cases, total] = await Promise.all([
      Case.find({ thana: req.params.thanaId })
        .populate('criminal', 'name name_bn nid photo')
        .populate('arrestingOfficer', 'name badgeNumber')
        .populate('court', 'name name_bn')
        .sort('-arrestDate')
        .skip(skip)
        .limit(limit),
      Case.countDocuments({ thana: req.params.thanaId }),
    ]);

    res.json({
      success: true,
      data: cases,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getByOfficer = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [cases, total] = await Promise.all([
      Case.find({ arrestingOfficer: req.params.officerId })
        .populate('criminal', 'name name_bn nid photo')
        .populate('thana', 'name name_bn')
        .populate('court', 'name name_bn')
        .sort('-arrestDate')
        .skip(skip)
        .limit(limit),
      Case.countDocuments({ arrestingOfficer: req.params.officerId }),
    ]);

    res.json({
      success: true,
      data: cases,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getByCourt = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [cases, total] = await Promise.all([
      Case.find({ court: req.params.courtId })
        .populate('criminal', 'name name_bn nid photo')
        .populate('arrestingOfficer', 'name badgeNumber')
        .populate('thana', 'name name_bn')
        .sort('-arrestDate')
        .skip(skip)
        .limit(limit),
      Case.countDocuments({ court: req.params.courtId }),
    ]);

    res.json({
      success: true,
      data: cases,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const caseRecord = await Case.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!caseRecord) {
      return res.status(404).json({ success: false, message: 'Case not found.' });
    }
    res.json({ success: true, message: 'Case updated.', data: caseRecord });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const caseRecord = await Case.findByIdAndDelete(req.params.id);
    if (!caseRecord) {
      return res.status(404).json({ success: false, message: 'Case not found.' });
    }

    await Criminal.findByIdAndUpdate(caseRecord.criminal, { $inc: { totalCases: -1 } });

    res.json({ success: true, message: 'Case deleted.' });
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { q, status } = req.query;
    const { page, limit, skip } = getPagination(req.query);

    const filter = {};
    if (status) filter.status = status;

    if (q) {
      const regex = buildSearchRegex(q);
      filter.$or = [
        { caseNumber: regex },
        { description: regex },
      ];
    }

    const [cases, total] = await Promise.all([
      Case.find(filter)
        .populate({
          path: 'criminal',
          match: q ? { $or: [{ name: buildSearchRegex(q) }, { name_bn: buildSearchRegex(q) }, { nid: buildSearchRegex(q) }] } : {},
          select: 'name name_bn nid photo',
        })
        .populate('arrestingOfficer', 'name badgeNumber')
        .populate('thana', 'name name_bn')
        .populate('court', 'name name_bn')
        .sort('-arrestDate')
        .skip(skip)
        .limit(limit),
      Case.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: cases,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getByStatus = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [cases, total] = await Promise.all([
      Case.find({ status: req.params.status })
        .populate('criminal', 'name name_bn nid photo')
        .populate('arrestingOfficer', 'name badgeNumber')
        .populate('thana', 'name name_bn')
        .populate('court', 'name name_bn')
        .sort('-arrestDate')
        .skip(skip)
        .limit(limit),
      Case.countDocuments({ status: req.params.status }),
    ]);

    res.json({
      success: true,
      data: cases,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};
