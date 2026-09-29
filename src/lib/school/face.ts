import type { Student } from "./types";

type FaceApi = {
  nets: {
    tinyFaceDetector: { loadFromUri: (uri: string) => Promise<unknown> };
    faceLandmark68Net: { loadFromUri: (uri: string) => Promise<unknown> };
    faceRecognitionNet: { loadFromUri: (uri: string) => Promise<unknown> };
  };
  TinyFaceDetectorOptions: new (opts: { inputSize: number; scoreThreshold: number }) => unknown;
  detectSingleFace: (
    input: HTMLVideoElement,
    options: unknown,
  ) => {
    withFaceLandmarks: () => {
      withFaceDescriptor: () => Promise<{ descriptor: Float32Array } | undefined>;
    };
  };
};

declare global {
  interface Window {
    faceapi?: FaceApi;
  }
}

let loading: Promise<void> | null = null;

export function loadFaceEngine() {
  if (typeof window === "undefined") return Promise.reject(new Error("No camera here."));
  if (window.faceapi?.nets) {
    return loading ?? (loading = loadModels());
  }
  if (loading) return loading;
  loading = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[data-face-api="1"]');
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Face engine failed to load.")));
      return;
    }
    const script = document.createElement("script");
    script.src = "/vendor/face-api.min.js";
    script.async = true;
    script.dataset.faceApi = "1";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Face engine failed to load."));
    document.head.appendChild(script);
  }).then(loadModels);
  return loading;
}

async function loadModels() {
  const api = window.faceapi;
  if (!api) throw new Error("Face engine missing.");
  const url = "/models";
  await Promise.all([
    api.nets.tinyFaceDetector.loadFromUri(url),
    api.nets.faceLandmark68Net.loadFromUri(url),
    api.nets.faceRecognitionNet.loadFromUri(url),
  ]);
}

export async function descriptorFromVideo(video: HTMLVideoElement) {
  await loadFaceEngine();
  const api = window.faceapi;
  if (!api) return null;
  const det = await api
    .detectSingleFace(video, new api.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (!det) return null;
  return Array.from(det.descriptor);
}

function distance(a: number[], b: number[]) {
  if (a.length !== b.length) return 999;
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
}

export function matchFace(students: Student[], descriptor: number[], threshold = 0.5) {
  let best: Student | null = null;
  let bestDist = threshold;
  for (const student of students) {
    for (const stored of student.descriptors) {
      const dist = distance(stored, descriptor);
      if (dist < bestDist) {
        bestDist = dist;
        best = student;
      }
    }
  }
  return best ? { student: best, distance: bestDist } : null;
}
