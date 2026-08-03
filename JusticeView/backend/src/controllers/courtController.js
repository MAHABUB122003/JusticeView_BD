const Court = require('../models/Court');

exports.create = async (req, res, next) => {
  try {
    const court = await Court.create(req.body);
    res.status(201).json({ success: true, message: 'Court created.', data: court });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { district, courtType } = req.query;
    const filter = {};
    if (district) filter.district = district;
    if (courtType) filter.courtType = courtType;

    const courts = await Court.find(filter).populate('district', 'name name_bn').sort({ name: 1 });
    res.json({ success: true, data: courts });
  } catch (error) {
    next(error);
  }
};

exports.getByDistrict = async (req, res, next) => {
  try {
    const courts = await Court.find({ district: req.params.districtId })
      .populate('district', 'name name_bn')
      .sort({ name: 1 });
    res.json({ success: true, data: courts });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const court = await Court.findById(req.params.id)
      .populate('district', 'name name_bn')
      .populate('judges');
    if (!court) {
      return res.status(404).json({ success: false, message: 'Court not found.' });
    }
    res.json({ success: true, data: court });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const court = await Court.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!court) {
      return res.status(404).json({ success: false, message: 'Court not found.' });
    }
    res.json({ success: true, message: 'Court updated.', data: court });
  } catch (error) {
    next(error);
  }
};
