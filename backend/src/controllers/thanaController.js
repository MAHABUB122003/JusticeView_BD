const Thana = require('../models/Thana');
const { getPagination, getPaginationResponse, getSortOptions, buildSearchRegex } = require('../utils/helpers');

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSortOptions(req.query, 'name');
    const { district } = req.query;

    const filter = {};
    if (district) filter.district = district;

    const [thanas, total] = await Promise.all([
      Thana.find(filter).populate('district', 'name name_bn').sort(sort).skip(skip).limit(limit),
      Thana.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: thanas,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const thana = await Thana.findById(req.params.id).populate('district', 'name name_bn');
    if (!thana) {
      return res.status(404).json({ success: false, message: 'Thana not found.' });
    }
    res.json({ success: true, data: thana });
  } catch (error) {
    next(error);
  }
};

exports.getByDistrict = async (req, res, next) => {
  try {
    const thanas = await Thana.find({ district: req.params.districtId })
      .populate('district', 'name name_bn')
      .sort({ name: 1 });
    res.json({ success: true, data: thanas });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const thana = await Thana.create(req.body);
    res.status(201).json({ success: true, message: 'Thana created.', data: thana });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const thana = await Thana.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!thana) {
      return res.status(404).json({ success: false, message: 'Thana not found.' });
    }
    res.json({ success: true, message: 'Thana updated.', data: thana });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const thana = await Thana.findByIdAndDelete(req.params.id);
    if (!thana) {
      return res.status(404).json({ success: false, message: 'Thana not found.' });
    }
    res.json({ success: true, message: 'Thana deleted.' });
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
    const conditions = [{ name: regex }, { name_bn: regex }, { address: regex }];
    if (q.match(/^[0-9a-fA-F]{24}$/)) {
      conditions.push({ _id: q });
    }
    const thanas = await Thana.find({ $or: conditions })
      .populate('district', 'name name_bn')
      .limit(20);

    res.json({ success: true, data: thanas });
  } catch (error) {
    next(error);
  }
};
