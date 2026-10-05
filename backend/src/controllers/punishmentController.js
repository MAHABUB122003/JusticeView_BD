const Punishment = require('../models/Punishment');
const Criminal = require('../models/Criminal');
const { getPagination, getPaginationResponse, getSortOptions } = require('../utils/helpers');

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, createdBy: req.user._id };

    if (data.sentenceStartDate && (data.imprisonmentYears || data.imprisonmentMonths || data.imprisonmentDays)) {
      const start = new Date(data.sentenceStartDate);
      const release = new Date(start);
      release.setFullYear(release.getFullYear() + (parseInt(data.imprisonmentYears) || 0));
      release.setMonth(release.getMonth() + (parseInt(data.imprisonmentMonths) || 0));
      release.setDate(release.getDate() + (parseInt(data.imprisonmentDays) || 0));
      data.expectedReleaseDate = release;
    }

    const punishment = await Punishment.create(data);

    if (data.punishmentType === 'death' || data.punishmentType === 'life_imprisonment' || data.imprisonmentYears > 0) {
      await Criminal.findByIdAndUpdate(data.criminal, { isActive: false });
    }

    res.status(201).json({ success: true, message: 'Punishment recorded.', data: punishment });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSortOptions(req.query, '-createdAt');
    const { punishmentType, isActive } = req.query;

    const filter = {};
    if (punishmentType) filter.punishmentType = punishmentType;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const [punishments, total] = await Promise.all([
      Punishment.find(filter)
        .populate('criminal', 'name name_bn nid photo')
        .populate('case', 'caseNumber')
        .populate('judgment', 'judgmentId verdictStatus')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Punishment.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: punishments,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const punishment = await Punishment.findById(req.params.id)
      .populate('criminal', 'name name_bn nid photo fatherName motherName')
      .populate('case', 'caseNumber sectionLaw lawAct')
      .populate('judgment', 'judgmentId verdictStatus judgmentDate');

    if (!punishment) {
      return res.status(404).json({ success: false, message: 'Punishment not found.' });
    }

    res.json({ success: true, data: punishment });
  } catch (error) {
    next(error);
  }
};

exports.getByCriminal = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [punishments, total] = await Promise.all([
      Punishment.find({ criminal: req.params.criminalId })
        .populate('case', 'caseNumber')
        .populate('judgment', 'judgmentDate')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Punishment.countDocuments({ criminal: req.params.criminalId }),
    ]);

    res.json({ success: true, data: punishments, pagination: getPaginationResponse(total, page, limit) });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const punishment = await Punishment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!punishment) {
      return res.status(404).json({ success: false, message: 'Punishment not found.' });
    }
    res.json({ success: true, message: 'Punishment updated.', data: punishment });
  } catch (error) {
    next(error);
  }
};

exports.release = async (req, res, next) => {
  try {
    const { releaseDate, releaseType, releaseOrderUrl } = req.body;
    const punishment = await Punishment.findByIdAndUpdate(
      req.params.id,
      { actualReleaseDate: releaseDate || new Date(), releaseType, releaseOrderUrl, isActive: false },
      { new: true }
    );
    if (!punishment) {
      return res.status(404).json({ success: false, message: 'Punishment not found.' });
    }

    await Criminal.findByIdAndUpdate(punishment.criminal, { isActive: true });

    res.json({ success: true, message: 'Criminal released.', data: punishment });
  } catch (error) {
    next(error);
  }
};
