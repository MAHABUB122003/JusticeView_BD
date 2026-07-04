const Case = require('../models/Case');
const Criminal = require('../models/Criminal');
const BailRecord = require('../models/BailRecord');
const Lawyer = require('../models/Lawyer');
const Judge = require('../models/Judge');
const PoliceOfficer = require('../models/PoliceOfficer');
const Thana = require('../models/Thana');
const District = require('../models/District');

exports.getDashboard = async (req, res, next) => {
  try {
    const [
      totalCases,
      totalCriminals,
      totalBails,
      totalLawyers,
      totalJudges,
      totalOfficers,
      repeatOffenders,
      pendingCases,
      trialCases,
      disposedCases,
    ] = await Promise.all([
      Case.countDocuments(),
      Criminal.countDocuments(),
      BailRecord.countDocuments(),
      Lawyer.countDocuments({ isActive: true }),
      Judge.countDocuments({ isActive: true }),
      PoliceOfficer.countDocuments({ isActive: true }),
      Criminal.countDocuments({ isRepeatOffender: true }),
      Case.countDocuments({ status: 'pending' }),
      Case.countDocuments({ status: 'trial' }),
      Case.countDocuments({ status: 'disposed' }),
    ]);

    res.json({
      success: true,
      data: {
        totalCases,
        totalCriminals,
        totalBails,
        totalLawyers,
        totalJudges,
        totalOfficers,
        repeatOffenders,
        pendingCases,
        trialCases,
        disposedCases,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getCriminalStats = async (req, res, next) => {
  try {
    const stats = await Criminal.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          male: { $sum: { $cond: [{ $eq: ['$gender', 'male'] }, 1, 0] } },
          female: { $sum: { $cond: [{ $eq: ['$gender', 'female'] }, 1, 0] } },
          other: { $sum: { $cond: [{ $eq: ['$gender', 'other'] }, 1, 0] } },
          repeatOffenders: { $sum: { $cond: ['$isRepeatOffender', 1, 0] } },
          avgCases: { $avg: '$totalCases' },
        },
      },
    ]);

    res.json({ success: true, data: stats[0] || {} });
  } catch (error) {
    next(error);
  }
};

exports.getCaseTrends = async (req, res, next) => {
  try {
    const { year } = req.query;
    const targetYear = parseInt(year) || new Date().getFullYear();

    const trends = await Case.aggregate([
      {
        $match: {
          arrestDate: {
            $gte: new Date(`${targetYear}-01-01`),
            $lte: new Date(`${targetYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$arrestDate' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const found = trends.find(t => t._id === month);
      return { month, count: found ? found.count : 0 };
    });

    res.json({ success: true, data: monthlyData });
  } catch (error) {
    next(error);
  }
};

exports.getBailTrends = async (req, res, next) => {
  try {
    const { year } = req.query;
    const targetYear = parseInt(year) || new Date().getFullYear();

    const trends = await BailRecord.aggregate([
      {
        $match: {
          bailDate: {
            $gte: new Date(`${targetYear}-01-01`),
            $lte: new Date(`${targetYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$bailDate' },
          count: { $sum: 1 },
          totalAmount: { $sum: '$bailAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const found = trends.find(t => t._id === month);
      return {
        month,
        count: found ? found.count : 0,
        totalAmount: found ? found.totalAmount : 0,
      };
    });

    res.json({ success: true, data: monthlyData });
  } catch (error) {
    next(error);
  }
};

exports.getDistrictWise = async (req, res, next) => {
  try {
    const stats = await Criminal.aggregate([
      {
        $group: {
          _id: '$district',
          count: { $sum: 1 },
          repeatOffenders: { $sum: { $cond: ['$isRepeatOffender', 1, 0] } },
        },
      },
      {
        $lookup: {
          from: 'districts',
          localField: '_id',
          foreignField: '_id',
          as: 'district',
        },
      },
      { $unwind: { path: '$district', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          districtId: '$_id',
          name: '$district.name',
          name_bn: '$district.name_bn',
          count: 1,
          repeatOffenders: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

exports.getThanaWise = async (req, res, next) => {
  try {
    const stats = await Case.aggregate([
      {
        $group: {
          _id: '$thana',
          totalCases: { $sum: 1 },
          pendingCases: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          disposedCases: { $sum: { $cond: [{ $eq: ['$status', 'disposed'] }, 1, 0] } },
        },
      },
      {
        $lookup: {
          from: 'thanas',
          localField: '_id',
          foreignField: '_id',
          as: 'thana',
        },
      },
      { $unwind: { path: '$thana', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          thanaId: '$_id',
          name: '$thana.name',
          name_bn: '$thana.name_bn',
          totalCases: 1,
          pendingCases: 1,
          disposedCases: 1,
        },
      },
      { $sort: { totalCases: -1 } },
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

exports.getTopLawyers = async (req, res, next) => {
  try {
    const topLawyers = await Lawyer.find({ isActive: true })
      .sort({ totalCases: -1 })
      .limit(10)
      .populate('district', 'name name_bn');

    res.json({ success: true, data: topLawyers });
  } catch (error) {
    next(error);
  }
};

exports.getTopJudges = async (req, res, next) => {
  try {
    const topJudges = await Judge.find({ isActive: true })
      .sort({ totalBailsGranted: -1 })
      .limit(10)
      .populate('court', 'name name_bn');

    res.json({ success: true, data: topJudges });
  } catch (error) {
    next(error);
  }
};

exports.getRepeatOffenders = async (req, res, next) => {
  try {
    const offenders = await Criminal.find({ isRepeatOffender: true })
      .sort({ totalCases: -1 })
      .limit(20)
      .populate('district', 'name name_bn');

    res.json({ success: true, data: offenders });
  } catch (error) {
    next(error);
  }
};

exports.getBailSuccessRate = async (req, res, next) => {
  try {
    const result = await BailRecord.aggregate([
      {
        $group: {
          _id: '$judge',
          totalBails: { $sum: 1 },
          totalAmount: { $sum: '$bailAmount' },
        },
      },
      {
        $lookup: {
          from: 'judges',
          localField: '_id',
          foreignField: '_id',
          as: 'judge',
        },
      },
      { $unwind: { path: '$judge', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          judgeId: '$_id',
          judgeName: '$judge.name',
          judgeName_bn: '$judge.name_bn',
          totalBails: 1,
          totalAmount: 1,
        },
      },
      { $sort: { totalBails: -1 } },
      { $limit: 10 },
    ]);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
