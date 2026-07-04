const District = require('../models/District');

exports.getAll = async (req, res, next) => {
  try {
    const { division } = req.query;
    const filter = {};
    if (division) filter.division = division;

    const districts = await District.find(filter).populate('division', 'name name_bn').sort({ name: 1 });
    res.json({ success: true, data: districts });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const district = await District.findById(req.params.id)
      .populate('division', 'name name_bn')
      .populate('thanas');
    if (!district) {
      return res.status(404).json({ success: false, message: 'District not found.' });
    }
    res.json({ success: true, data: district });
  } catch (error) {
    next(error);
  }
};

exports.getByDivision = async (req, res, next) => {
  try {
    const districts = await District.find({ division: req.params.divisionId })
      .populate('division', 'name name_bn')
      .sort({ name: 1 });
    res.json({ success: true, data: districts });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const district = await District.create(req.body);
    res.status(201).json({ success: true, message: 'District created.', data: district });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const district = await District.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!district) {
      return res.status(404).json({ success: false, message: 'District not found.' });
    }
    res.json({ success: true, message: 'District updated.', data: district });
  } catch (error) {
    next(error);
  }
};
