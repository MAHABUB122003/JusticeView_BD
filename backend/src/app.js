const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(s => s.trim()),
  credentials: true,
}));

// Performance
app.use(compression());

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use('/api/', generalLimiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/face-models', express.static(path.join(__dirname, '../face-models')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/divisions', require('./routes/divisionRoutes'));
app.use('/api/districts', require('./routes/districtRoutes'));
app.use('/api/thanas', require('./routes/thanaRoutes'));
app.use('/api/police-officers', require('./routes/policeOfficerRoutes'));
app.use('/api/criminals', require('./routes/criminalRoutes'));
app.use('/api/courts', require('./routes/courtRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/lawyers', require('./routes/lawyerRoutes'));
app.use('/api/judges', require('./routes/judgeRoutes'));
app.use('/api/bail-records', require('./routes/bailRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/professionals', require('./routes/professionalRoutes'));
app.use('/api/image-search', require('./routes/imageSearchRoutes'));
app.use('/api/judgments', require('./routes/judgmentRoutes'));
app.use('/api/punishments', require('./routes/punishmentRoutes'));
app.use('/api/evidence', require('./routes/evidenceRoutes'));
app.use('/api/hearings', require('./routes/hearingRoutes'));
app.use('/api/charge-sheets', require('./routes/chargeSheetRoutes'));
app.use('/api/appeals', require('./routes/appealRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'JusticeView API is running.' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
