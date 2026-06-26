export type CropRecommendationInput = {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
};

export type CropRecommendationResult = {
  crop: string;
  confidence: number;
  description: string;
  growingSeason: string;
  waterRequirement: string;
  alternativeCrops: { name: string; confidence: number }[];
};

export type YieldPredictionInput = {
  cropType: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  fertilizerUsage: number;
};

export type YieldPredictionResult = {
  predictedYield: number;
  unit: string;
  confidence: number;
  historicalData: { month: string; yield: number; predicted: number }[];
};

export type SoilAnalysisInput = {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  organicMatter: number;
  moisture: number;
};

export type SoilData = {
  healthScore: number;
  cluster: string;
  clusterDescription: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  organicMatter: number;
  moisture: number;
  recommendations: string[];
};

export type PcaAnalysisInput = {
  samples: number[][];
  features: string[];
  n_components: number;
};

export type PcaAnalysisResult = {
  components: number[][];
  explainedVariance: number[];
  transformedData: number[][];
  features: string[];
};

const jsonHeaders = { "Content-Type": "application/json" };

async function apiPost<TBody, TResponse>(path: string, body: TBody): Promise<TResponse> {
  const response = await fetch(path, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export function fetchCropRecommendation(input: CropRecommendationInput) {
  return apiPost<CropRecommendationInput, CropRecommendationResult>("/api/crop/recommend", input);
}

export function fetchYieldPrediction(input: YieldPredictionInput) {
  return apiPost<YieldPredictionInput, YieldPredictionResult>("/api/yield/predict", input);
}

export function fetchSoilAnalysis(input: SoilAnalysisInput) {
  return apiPost<SoilAnalysisInput, SoilData>("/api/soil/analyze", input);
}

export function fetchPcaAnalysis(input: PcaAnalysisInput) {
  return apiPost<PcaAnalysisInput, PcaAnalysisResult>("/api/pca/analyze", input);
}

export async function fetchPcaStatus() {
  const response = await fetch("/api/pca/status");
  if (!response.ok) {
    throw new Error("Failed to fetch PCA status");
  }

  return response.json() as Promise<{ status: string }>;
}
