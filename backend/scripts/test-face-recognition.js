/**
 * Test the face recognition search endpoint
 * Run: node scripts/test-face-recognition.js
 */
const http = require('http');
const { Jimp } = require('jimp');

async function main() {
  const img = new Jimp({ data: Buffer.alloc(200 * 200 * 4), width: 200, height: 200 });
  const buf = await img.getBuffer('image/png');

  const boundary = '----TestBoundary' + Date.now();
  const header = '--' + boundary + '\r\nContent-Disposition: form-data; name="image"; filename="test.png"\r\nContent-Type: image/png\r\n\r\n';
  const footer = '\r\n--' + boundary + '--\r\n';

  const body = Buffer.concat([
    Buffer.from(header),
    buf,
    Buffer.from(footer),
  ]);

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

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      try {
        const json = JSON.parse(data);
        console.log(JSON.stringify(json, null, 2));
      } catch {
        console.log('Raw:', data.substring(0, 1000));
      }
    });
  });

  req.on('error', (e) => console.error('Error:', e.message));
  req.write(body);
  req.end();
}

main().catch(console.error);
