const CriminalFace = require('../models/CriminalFace');

class FaceRecognitionService {
  /**
   * Compute Euclidean distance between two face descriptor arrays
   */
  euclideanDistance(descriptor1, descriptor2) {
    if (descriptor1.length !== descriptor2.length) {
      throw new Error('Face descriptors must have same length');
    }

    let sum = 0;
    for (let i = 0; i < descriptor1.length; i++) {
      sum += Math.pow(descriptor1[i] - descriptor2[i], 2);
    }
    return Math.sqrt(sum);
  }

  /**
   * Normalize a face descriptor array to unit length
   */
  normalizeDescriptor(descriptor) {
    const norm = Math.sqrt(descriptor.reduce((sum, val) => sum + val * val, 0));
    if (norm === 0) return descriptor;
    return descriptor.map(val => val / norm);
  }

  /**
   * Find matching criminals by comparing face descriptors
   */
  async findMatchingCriminals(faceDescriptor, limit = 10, threshold = 0.6) {
    const allFaces = await CriminalFace.find()
      .populate({
        path: 'criminal',
        select: 'name name_bn nid photo fatherName motherName gender dateOfBirth address totalCases totalBails isRepeatOffender createdAt',
      })
      .lean();

    if (allFaces.length === 0) {
      return [];
    }

    const queryDesc = this.normalizeDescriptor(faceDescriptor);

    const matches = allFaces.map(faceData => {
      const storedDesc = this.normalizeDescriptor(faceData.face_encoding);
      const distance = this.euclideanDistance(queryDesc, storedDesc);

      // Convert distance to similarity percentage (0-100)
      // face-api.js typical distances: 0 = identical, ~0.6 = different
      const similarity = Math.max(0, Math.min(100, (1 - distance) * 100));
      const isMatch = similarity >= threshold * 100;

      return {
        criminal: faceData.criminal,
        face_id: faceData._id,
        similarity: parseFloat(similarity.toFixed(2)),
        distance: parseFloat(distance.toFixed(4)),
        is_match: isMatch,
      };
    });

    return matches
      .filter(m => m.is_match)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  /**
   * Search criminals by uploaded image buffer
   * @param {Buffer} imageBuffer - Raw image file buffer
   * @param {number} limit - Max results
   * @param {number} threshold - Minimum similarity threshold (0-1)
   */
  async searchByImage(imageBuffer, limit = 10, threshold = 0.6) {
    try {
      const faceapi = await this._loadFaceApi();
      const img = await this._loadImage(imageBuffer);

      const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        return {
          success: false,
          message: 'No face detected in the image. Please upload a clear photo of a face.',
          matches: [],
        };
      }

      const descriptor = Array.from(detection.descriptor);

      const matches = await this.findMatchingCriminals(descriptor, limit, threshold);

      return {
        success: true,
        message: matches.length > 0
          ? `${matches.length} match${matches.length > 1 ? 'es' : ''} found`
          : 'No matching criminals found',
        matches,
        uploaded_face: {
          confidence: detection.detection.score,
          has_landmarks: detection.landmarks.positions.length > 0,
        },
      };
    } catch (error) {
      // If face-api.js is not available, fall back to direct DB matching
      if (error.message === 'FACE_API_NOT_AVAILABLE') {
        return {
          success: false,
          message: 'Face recognition engine is not available. Please install face-api.js and canvas packages.',
          matches: [],
        };
      }
      throw error;
    }
  }

  /**
   * Add a criminal face encoding to the database
   */
  async addCriminalFace(criminalId, imageBuffer, isPrimary = false) {
    try {
      const faceapi = await this._loadFaceApi();
      const img = await this._loadImage(imageBuffer);

      const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        throw new Error('No face detected in image');
      }

      if (isPrimary) {
        await CriminalFace.updateMany(
          { criminal: criminalId, is_primary: true },
          { is_primary: false },
        );
      }

      const descriptor = Array.from(detection.descriptor);

      const criminalFace = await CriminalFace.create({
        criminal: criminalId,
        face_encoding: descriptor,
        face_descriptor: JSON.stringify({
          descriptor,
          landmarks: detection.landmarks.positions,
          faceBox: detection.detection.box,
        }),
        confidence_score: detection.detection.score,
        face_box: detection.detection.box,
        is_primary: isPrimary,
      });

      return { success: true, criminalFace };
    } catch (error) {
      if (error.message === 'FACE_API_NOT_AVAILABLE') {
        throw new Error('Face recognition engine is not available. Please install face-api.js and canvas packages.');
      }
      throw error;
    }
  }

  /**
   * Try to load face-api.js dynamically with canvas or Jimp polyfill
   */
  async _loadFaceApi() {
    // Ensure WASM backend is active for fast inference
    try {
      const tf = require('@tensorflow/tfjs-core');
      if (tf.getBackend() !== 'wasm') {
        await tf.setBackend('wasm');
      }
    } catch (_) {}

    const faceapi = require('face-api.js');
    const path = require('path');

    // Try native canvas first, fall back to Jimp polyfill
    let Canvas, Image, ImageData;
    try {
      const canvas = require('canvas');
      Canvas = canvas.Canvas;
      Image = canvas.Image;
      ImageData = canvas.ImageData;
    } catch {
      const polyfill = require('./canvasPolyfill');
      Canvas = polyfill.Canvas;
      Image = polyfill.Image;
      ImageData = polyfill.ImageData;
    }

    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

    // Models may already be loaded by server.js eager init
    const modelPath = path.join(__dirname, '../../face-models');
    const isLoaded = faceapi.nets.ssdMobilenetv1.isLoaded;
    if (!isLoaded) {
      await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
      await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
      await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
    }

    return faceapi;
  }

  /**
   * Load image from buffer using canvas (native) or Jimp polyfill
   */
  async _loadImage(imageBuffer) {
    try {
      const canvas = require('canvas');
      return await canvas.loadImage(imageBuffer);
    } catch {
      const polyfill = require('./canvasPolyfill');
      return polyfill.loadImage(imageBuffer);
    }
  }

  /**
   * Get all faces for a criminal
   */
  async getCriminalFaces(criminalId) {
    return CriminalFace.find({ criminal: criminalId })
      .sort({ is_primary: -1, confidence_score: -1 });
  }

  /**
   * Update a criminal face
   */
  async updateCriminalFace(faceId, imageBuffer) {
    const faceapi = await this._loadFaceApi();
    const img = await this._loadImage(imageBuffer);

    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      throw new Error('No face detected in image');
    }

    const descriptor = Array.from(detection.descriptor);

    const updated = await CriminalFace.findByIdAndUpdate(
      faceId,
      {
        face_encoding: descriptor,
        face_descriptor: JSON.stringify({
          descriptor,
          landmarks: detection.landmarks.positions,
          faceBox: detection.detection.box,
        }),
        confidence_score: detection.detection.score,
        face_box: detection.detection.box,
      },
      { new: true },
    );

    return { success: true, criminalFace: updated };
  }

  /**
   * Delete a criminal face
   */
  async deleteCriminalFace(faceId) {
    const result = await CriminalFace.findByIdAndDelete(faceId);
    return { success: true, deleted: !!result };
  }

  /**
   * Direct descriptor matching (without face-api.js) - for when face-api is not installed
   * Compares uploaded descriptor against stored encodings using Euclidean distance
   */
  async searchByDescriptor(descriptor, limit = 10, threshold = 0.6) {
    return this.findMatchingCriminals(descriptor, limit, threshold);
  }
}

module.exports = new FaceRecognitionService();
