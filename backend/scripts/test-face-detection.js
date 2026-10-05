/**
 * Test face detection with a real image (downloads a sample face)
 * Run: node scripts/test-face-detection.js
 */
const https = require('https');
const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) reject(new Error('HTTP ' + res.statusCode));
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function main() {
  // Try to download a sample face image
  let imageBuffer;
  try {
    console.log('Downloading sample face image...');
    imageBuffer = await downloadImage('https://raw.githubusercontent.com/opencv/opencv/master/samples/data/lena.jpg');
    console.log('Downloaded:', imageBuffer.length, 'bytes');
  } catch (e) {
    console.log('Download failed:', e.message);
    // Create a synthetic face-like image
    const img = new Jimp({ data: Buffer.alloc(200*200*4), width: 200, height: 200 });
    // Draw a face-like pattern
    for (let y = 0; y < 200; y++) {
      for (let x = 0; x < 200; x++) {
        const idx = (y * 200 + x) * 4;
        const cx = 100, cy = 100;
        const dist = Math.sqrt((x-cx)**2 + (y-cy)**2);
        if (dist < 60) {
          img.bitmap.data[idx] = 220;     // R - skin tone
          img.bitmap.data[idx+1] = 180;   // G
          img.bitmap.data[idx+2] = 150;   // B
          img.bitmap.data[idx+3] = 255;   // A
        }
        // eyes
        if (Math.abs(x-75) < 8 && Math.abs(y-80) < 8) {
          img.bitmap.data[idx] = 0; img.bitmap.data[idx+1] = 0; img.bitmap.data[idx+2] = 0;
        }
        if (Math.abs(x-125) < 8 && Math.abs(y-80) < 8) {
          img.bitmap.data[idx] = 0; img.bitmap.data[idx+1] = 0; img.bitmap.data[idx+2] = 0;
        }
      }
    }
    imageBuffer = await img.getBuffer('image/png');
    console.log('Created synthetic image:', imageBuffer.length, 'bytes');
  }

  const http = require('http');
  const boundary = '----TestBoundary' + Date.now();
  const header = '--' + boundary + '\r\nContent-Disposition: form-data; name="image"; filename="face.png"\r\nContent-Type: image/png\r\n\r\n';
  const footer = '\r\n--' + boundary + '--\r\n';

  const body = Buffer.concat([Buffer.from(header), imageBuffer, Buffer.from(footer)]);

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/image-search/search-by-image',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data; boundary=' + boundary,
      'Content-Length': body.length,
    },
  };

  console.log('Sending request...');
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      try {
        const json = JSON.parse(data);
        console.log(JSON.stringify(json, null, 2));
      } catch {
        console.log('Raw:', data.substring(0, 2000));
      }
    });
  });

  req.on('error', (e) => console.error('Request Error:', e.message));
  req.setTimeout(30000);
  req.write(body);
  req.end();
}

main().catch(console.error);
