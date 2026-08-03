const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const Setting = require('../models/Setting');
const { getPagination, getPaginationResponse } = require('../utils/helpers');

exports.getUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { role, isActive } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const [users, total] = await Promise.all([
      User.find(filter).sort('-createdAt').skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, message: 'User role updated.', data: user });
  } catch (error) {
    next(error);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'}.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAuditLogs = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { action, model, userId } = req.query;

    const filter = {};
    if (action) filter.action = action;
    if (model) filter.model = model;
    if (userId) filter.user = userId;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate('user', 'name email role')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      AuditLog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: getPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getSystemStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeUsers,
      policeOfficers,
      courtClerks,
      publicUsers,
      admins,
      todayLogins,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'police_officer' }),
      User.countDocuments({ role: 'court_clerk' }),
      User.countDocuments({ role: 'public_user' }),
      User.countDocuments({ role: { $in: ['super_admin', 'admin'] } }),
      AuditLog.countDocuments({
        action: 'login',
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        policeOfficers,
        courtClerks,
        publicUsers,
        admins,
        todayLogins,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const settings = await Setting.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, message: 'Settings updated.', data: settings });
  } catch (error) {
    next(error);
  }
};
