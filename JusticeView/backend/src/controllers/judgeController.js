const Judge = require('../models/Judge');

exports.create = async (req, res, next) => {
  try {
    const judge = await Judge.create(req.body);
    res.status(201).json({ success: true, message: 'Judge created.', data: judge });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { court } = req.query;
    const filter = {};
    if (court) filter.court = court;

    const judges = await Judge.find(filter).populate('court', 'name name_bn courtType').sort({ name: 1 });
    res.json({ success: true, data: judges });
  } catch (error) {
    next(error);
  }
};

exports.getByCourt = async (req, res, next) => {
  try {
    const judges = await Judge.find({ court: req.params.courtId })
      .populate('court', 'name name_bn courtType')
      .sort({ name: 1 });
    res.json({ success: true, data: judges });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const judge = await Judge.findById(req.params.id)
      .populate('court', 'name name_bn courtType address')
      .populate({
        path: 'bailRecords',
        populate: [
          { path: 'case', select: 'caseNumber' },
          { path: 'criminal', select: 'name name_bn' },
          { path: 'lawyer', select: 'name' },
        ],
        options: { sort: { bailDate: -1 }, limit: 50 },
      });

    if (!judge) {
      return res.status(404).json({ success: false, message: 'Judge not found.' });
    }

    res.json({ success: true, data: judge });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const judge = await Judge.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!judge) {
      return res.status(404).json({ success: false, message: 'Judge not found.' });
    }
    res.json({ success: true, message: 'Judge updated.', data: judge });
  } catch (error) {
    next(error);
  }
};

exports.getTopBail = async (req, res, next) => {
  try {
    const judges = await Judge.find({ isActive: true })
      .sort({ totalBailsGranted: -1 })
      .limit(10)
      .populate('court', 'name name_bn');

    res.json({ success: true, data: judges });
  } catch (error) {
    next(error);
  }
};
