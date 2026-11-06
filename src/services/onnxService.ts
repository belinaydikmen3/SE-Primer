import * as ort from 'onnxruntime-web';
import type { BehavioralMetrics, ModelPrediction } from '../types';

// Configure ONNX Runtime Web WASM paths to serve from root / public
if (typeof window !== 'undefined') {
  ort.env.wasm.wasmPaths = '/';
  ort.env.wasm.numThreads = 1;
}

export const FEATURE_ORDER: (keyof BehavioralMetrics)[] = [
  'karar_suresi_sn',
  'karar_degistirme_sayisi',
  'onceki_basarisiz_karar_sayisi',
  'ortalama_karar_suresi_sn',
  'sahne_zorlugu',
  'yardim_kullanim_sayisi',
  'oyuncu_deneyim_seviyesi',
  'sahne_ilerleme_orani',
];

export const MODEL_CONFIG = {
  version: 'v2.0',
  threshold: 0.50,
  modelPath: '/model/model.onnx',
};

let sessionInstance: ort.InferenceSession | null = null;
let sessionLoadingPromise: Promise<ort.InferenceSession | null> | null = null;

/**
 * Loads the ONNX inference session as a singleton using ArrayBuffer fetch
 */
export async function getInferenceSession(): Promise<ort.InferenceSession | null> {
  if (sessionInstance) return sessionInstance;
  if (sessionLoadingPromise) return sessionLoadingPromise;

  sessionLoadingPromise = (async () => {
    try {
      if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
        const resp = await fetch(MODEL_CONFIG.modelPath);
        if (resp.ok) {
          const buffer = await resp.arrayBuffer();
          const session = await ort.InferenceSession.create(new Uint8Array(buffer), {
            executionProviders: ['wasm'],
            graphOptimizationLevel: 'all',
          });
          sessionInstance = session;
          return session;
        }
      }

      const session = await ort.InferenceSession.create(MODEL_CONFIG.modelPath, {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all',
      });
      sessionInstance = session;
      return session;
    } catch (err) {
      console.warn('ONNX Runtime Web session could not be created:', err);
      return null;
    } finally {
      sessionLoadingPromise = null;
    }
  })();

  return sessionLoadingPromise;
}

/**
 * Runs inference with an arbitrary 8-element feature vector
 */
export async function runInferenceVector(vector: number[]): Promise<{ label: number; probability: number; isFallback: boolean }> {
  const session = await getInferenceSession();

  if (!session) {
    // Fallback heuristic if ONNX not available
    const [time, changes, prevFailed, , , , exp] = vector;
    const isStruggling = time > 35.0 || changes >= 2 || (prevFailed >= 1 && time > 25.0) || (exp === 0 && time > 20.0);
    return {
      label: isStruggling ? 1 : 0,
      probability: isStruggling ? 1.0 : 0.0,
      isFallback: true,
    };
  }

  try {
    const inputTensor = new ort.Tensor('float32', new Float32Array(vector), [1, 8]);
    const feeds: Record<string, ort.Tensor> = { float_input: inputTensor };
    const results = await session.run(feeds);

    const probTensor = results.probabilities;
    const labelTensor = results.label;

    const probData = probTensor.data as Float32Array;
    const positiveProb = Number(probData[1]);
    const predictedLabel = labelTensor ? Number((labelTensor.data as BigInt64Array | Int32Array)[0]) : (positiveProb >= MODEL_CONFIG.threshold ? 1 : 0);

    return {
      label: predictedLabel,
      probability: positiveProb,
      isFallback: false,
    };
  } catch (err) {
    console.error('ONNX inference error:', err);
    return { label: 0, probability: 0.0, isFallback: true };
  }
}

/**
 * Evaluates behavioral metrics from gameplay and returns structured ModelPrediction
 */
export async function predictSupportNeed(metrics: BehavioralMetrics): Promise<ModelPrediction> {
  const vector = FEATURE_ORDER.map((f) => metrics[f]);
  const res = await runInferenceVector(vector);

  return {
    probability: res.probability,
    predictedLabel: res.label as 0 | 1,
    isSupportNeeded: res.probability >= MODEL_CONFIG.threshold,
    isLoaded: !res.isFallback,
    isEvaluating: false,
    modelVersion: MODEL_CONFIG.version,
    error: null,
    source: res.isFallback ? 'fallback' : 'onnx',
  };
}
