require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./config/db");
const logger = require("./src/utils/logger");

// Connect Database
connectDB();

// Eagerly load face recognition models at startup
const path = require('path');
(async () => {
  try {
    const faceapi = require('face-api.js');
    const polyfill = require('./src/services/canvasPolyfill');
    const { Canvas, Image, ImageData } = polyfill;
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
    const modelPath = path.join(__dirname, 'face-models');
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
    logger.info('Face recognition models loaded successfully');
  } catch (err) {
    logger.warn('Face recognition models failed to load: ' + err.message);
  }
})();

// Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  logger.info(`JusticeView server running on port ${PORT}`);
  console.log(`🚀 JusticeView server running on http://localhost:${PORT}`);
});