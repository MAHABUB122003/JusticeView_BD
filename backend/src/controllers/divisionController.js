const Division = require('../models/Division');

exports.getAll = async (req, res, next) => {
  try {
    const divisions = await Division.find().sort({ name: 1 });
    res.json({ success: true, data: divisions });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const division = await Division.findById(req.params.id).populate('districts');
    if (!division) {
      return res.status(404).json({ success: false, message: 'Division not found.' });
    }
    res.json({ success: true, data: division });
  } catch (error) {
    next(error);
  }
};
