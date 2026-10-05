const path = require('path');

class PolyfillCanvasRenderingContext2D {
  constructor(canvas) {
    this.canvas = canvas;
    this._imageData = null;
  }

  drawImage(image, dx, dy, dw, dh) {
    if (!image) return;
    const srcJimp = image._jimp;
    const srcW = image._width || image.naturalWidth || 0;
    const srcH = image._height || image.naturalHeight || 0;

    const tw = Math.floor(dw || srcW);
    const th = Math.floor(dh || srcH);

    // Load source Jimp if available (from Image or another Canvas)
    let src;
    if (srcJimp) {
      src = srcJimp.clone();
      if (tw !== srcJimp.bitmap.width || th !== srcJimp.bitmap.height) {
        src.resize({ w: tw, h: th });
      }
    } else if (tw > 0 && th > 0) {
      const { Jimp } = require('jimp');
      src = new Jimp({ data: Buffer.alloc(tw * th * 4), width: tw, height: th });
    }

    // Composite source onto canvas at (dx, dy)
    if (src) {
      const cw = this.canvas._width;
      const ch = this.canvas._height;
      if (this.canvas._jimp) {
        this.canvas._jimp.composite(src, Math.floor(dx || 0), Math.floor(dy || 0));
      } else if (cw > 0 && ch > 0) {
        const { Jimp } = require('jimp');
        const bg = new Jimp({ data: Buffer.alloc(cw * ch * 4), width: cw, height: ch });
        bg.composite(src, Math.floor(dx || 0), Math.floor(dy || 0));
        this.canvas._jimp = bg;
      } else {
        this.canvas._jimp = src;
      }
    }
  }

  getImageData(sx, sy, sw, sh) {
    if (this.canvas._jimp) {
      const jimp = this.canvas._jimp;
      const pixels = new Uint8ClampedArray(sw * sh * 4);
      let idx = 0;
      for (let y = sy; y < sy + sh && y < jimp.bitmap.height; y++) {
        for (let x = sx; x < sx + sw && x < jimp.bitmap.width; x++) {
          const pi = (y * jimp.bitmap.width + x) * 4;
          if (pi + 3 < jimp.bitmap.data.length) {
            pixels[idx] = jimp.bitmap.data[pi];
            pixels[idx + 1] = jimp.bitmap.data[pi + 1];
            pixels[idx + 2] = jimp.bitmap.data[pi + 2];
            pixels[idx + 3] = jimp.bitmap.data[pi + 3];
          }
          idx += 4;
        }
      }
      return { data: pixels, width: sw, height: sh };
    }
    return { data: new Uint8ClampedArray(sw * sh * 4), width: sw, height: sh };
  }

  putImageData(imageData, dx, dy) { }
}

class PolyfillCanvas {
  constructor(width, height) {
    this._width = width || 0;
    this._height = height || 0;
    this._jimp = null;
  }

  get width() { return this._width; }
  set width(val) { this._width = val; }
  get height() { return this._height; }
  set height(val) { this._height = val; }

  getContext(type) {
    if (!this._ctx) {
      this._ctx = new PolyfillCanvasRenderingContext2D(this);
    }
    return this._ctx;
  }

  toDataURL() {
    return '';
  }
}

class PolyfillImage {
  constructor() {
    this._src = null;
    this._width = 0;
    this._height = 0;
    this._jimp = null;
    this.complete = true;
  }

  get width() { return this._width; }
  get height() { return this._height; }
  get naturalWidth() { return this._width; }
  get naturalHeight() { return this._height; }
  get src() { return this._src; }
  set src(val) {
    if (typeof val === 'string') {
      this._src = val;
    }
  }
}

class PolyfillImageData {
  constructor(data, width, height) {
    this.data = data;
    this.width = width;
    this.height = height;
  }
}

async function loadImage(buffer) {
  const { Jimp } = require('jimp');
  const jimpImg = await Jimp.read(buffer);
  const img = new PolyfillImage();
  img._width = jimpImg.bitmap.width;
  img._height = jimpImg.bitmap.height;
  img._jimp = jimpImg;
  return img;
}

function createCanvas(width, height) {
  return new PolyfillCanvas(width, height);
}

module.exports = {
  loadImage,
  Image: PolyfillImage,
  Canvas: PolyfillCanvas,
  ImageData: PolyfillImageData,
  createCanvas,
};
