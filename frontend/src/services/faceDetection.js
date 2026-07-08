import * as faceapi from 'face-api.js';
import { API_URL } from './api';

const MODEL_URL = `${API_URL}/face-models`;

let modelsLoaded = false;

export async function loadFaceModels() {
  if (modelsLoaded) return true;
  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;
    return true;
  } catch {
    return false;
  }
}

export async function detectFace(imageElement) {
  if (!modelsLoaded) {
    const ok = await loadFaceModels();
    if (!ok) return null;
  }

  const fullDesc = await faceapi
    .detectSingleFace(imageElement)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!fullDesc) return null;

  return {
    descriptor: Array.from(fullDesc.descriptor),
    detection: fullDesc.detection,
    landmarks: fullDesc.landmarks,
  };
}
