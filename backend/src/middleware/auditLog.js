const AuditLog = require('../models/AuditLog');

const auditLog = (action, model) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = async function (body) {
      if (res.statusCode >= 200 && res.statusCode < 300 && body?.success !== false) {
        try {
          let documentId = null;
          let newData = null;
          let oldData = null;

          if (req.params?.id) {
            documentId = req.params.id;
          } else if (body?.data?._id) {
            documentId = body.data._id;
          } else if (body?._id) {
            documentId = body._id;
          }

          if (['create', 'update'].includes(action) && body?.data) {
            newData = body.data;
          }

          if (req.oldDocument) {
            oldData = req.oldDocument;
          }

          await AuditLog.create({
            user: req.user?._id,
            action,
            model,
            documentId,
            oldData,
            newData,
            ipAddress: req.ip || req.connection?.remoteAddress,
            userAgent: req.headers['user-agent'],
          });
        } catch (error) {
          // Silently fail - audit logging shouldn't break the request
        }
      }

      return originalJson(body);
    };

    next();
  };
};

module.exports = auditLog;
