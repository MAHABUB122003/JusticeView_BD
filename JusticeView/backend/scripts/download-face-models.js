/**
 * Download face-api.js model files
 * Run: node scripts/download-face-models.js
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

const MODELS_DIR = path.join(__dirname, '..', 'face-models');

const MODEL_FILES = [
  // SSD Mobilenet v1
  'ssd_mobilenetv1_model-weights_manifest.json',
  'ssd_mobilenetv1_model-shard1',
  'ssd_mobilenetv1_model-shard2',
  // Face Landmark 68
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  // Face Recognition
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2',
];

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        // Try alternate URL if first fails
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Downloading face-api.js models...\n');

  for (const fileName of MODEL_FILES) {
    const url = `${BASE_URL}/${fileName}`;
    const dest = path.join(MODELS_DIR, fileName);
    process.stdout.write(`  ${fileName}... `);
    try {
      await download(url, dest);
      console.log('OK');
    } catch (err) {
      console.log('FAILED:', err.message);
    }
  }

  console.log('\nDone! Models saved to:', MODELS_DIR);
  console.log('Files:', fs.readdirSync(MODELS_DIR).join(', '));
}

main().catch(console.error);
