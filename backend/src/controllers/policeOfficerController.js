const PoliceOfficer = require('../models/PoliceOfficer');
const User = require('../models/User');
const { getPagination, getPaginationResponse } = require('../utils/helpers');

exports.create = async (req, res, next) => {
  try {
    const { name, name_bn, designation, badgeNumber, email, phone, thana } = req.body;

    let user = null;
    if (email) {
      user = await User.create({
        name,
        email,
        password: badgeNumber + 'Pass123!',
        role: 'police_officer',
        phone,
        thana,
      });
    }

    const officer = await PoliceOfficer.create({
      user: user?._id,
      name,
      name_bn,
      designation,
      badgeNumber,
      email,
      phone,
      thana,
    });

    res.status(201).json({ success: true, message: 'Police officer created.', data: officer });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { thana } = req.query;

    const filter = {};
    if (thana) filter.thana = thana;

    const [officers, total] = await Promise.all([
      PoliceOfficer.find(filter).populate('thana', 'name name_bn').sort('-createdAt').skip(skip).limit(limit),
      PoliceOfficer.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: officers,
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
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const isObjectId = q.match(/^[0-9a-fA-F]{24}$/);
    const conditions = [{ name: regex }, { name_bn: regex }, { badgeNumber: regex }, { designation: regex }];
    if (isObjectId) {
      conditions.push({ _id: q });
    }
    const officers = await PoliceOfficer.find({ $or: conditions })
      .populate('thana', 'name name_bn')
      .limit(20);
    res.json({ success: true, data: officers });
  } catch (error) {
    next(error);
  }
};

exports.getByThana = async (req, res, next) => {
  try {
    const officers = await PoliceOfficer.find({ thana: req.params.thanaId })
      .populate('thana', 'name name_bn')
      .sort({ name: 1 });
    res.json({ success: true, data: officers });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const officer = await PoliceOfficer.findById(req.params.id)
      .populate('thana', 'name name_bn')
      .populate('cases');
    if (!officer) {
      return res.status(404).json({ success: false, message: 'Police officer not found.' });
    }
    res.json({ success: true, data: officer });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const officer = await PoliceOfficer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!officer) {
      return res.status(404).json({ success: false, message: 'Police officer not found.' });
    }
    res.json({ success: true, message: 'Officer updated.', data: officer });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const officer = await PoliceOfficer.findByIdAndDelete(req.params.id);
    if (!officer) {
      return res.status(404).json({ success: false, message: 'Police officer not found.' });
    }
    if (officer.user) {
      await User.findByIdAndDelete(officer.user);
    }
    res.json({ success: true, message: 'Police officer deleted.' });
  } catch (error) {
    next(error);
  }
};
