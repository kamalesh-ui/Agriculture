import { useState, type ChangeEvent, type FormEvent } from "react";
import { Line, Scatter } from "react-chartjs-2";
import {
  CropRecommendationInput,
  CropRecommendationResult,
  YieldPredictionInput,
  YieldPredictionResult,
  SoilAnalysisInput,
  SoilData,
  fetchCropRecommendation,
  fetchYieldPrediction,
  fetchSoilAnalysis,
} from "../services/api";

const defaultCropInput: CropRecommendationInput = {
  nitrogen: 50,
  phosphorus: 35,
  potassium: 30,
  temperature: 24,
  humidity: 60,
  ph: 6.8,
  rainfall: 140,
};

const defaultYieldInput: YieldPredictionInput = {
  cropType: "Wheat",
  temperature: 24,
  humidity: 60,
  rainfall: 130,
  fertilizerUsage: 30,
};

const defaultSoilInput: SoilAnalysisInput = {
  nitrogen: 45,
  phosphorus: 30,
  potassium: 28,
  ph: 6.6,
  organicMatter: 4.5,
  moisture: 35,
};

export default function Analytics() {
  const [cropInput, setCropInput] = useState<CropRecommendationInput>(defaultCropInput);
  const [cropResult, setCropResult] = useState<CropRecommendationResult | null>(null);
  const [cropLoading, setCropLoading] = useState(false);
  const [cropError, setCropError] = useState<string | null>(null);

  const [yieldInput, setYieldInput] = useState<YieldPredictionInput>(defaultYieldInput);
  const [yieldResult, setYieldResult] = useState<YieldPredictionResult | null>(null);
  const [yieldLoading, setYieldLoading] = useState(false);
  const [yieldError, setYieldError] = useState<string | null>(null);

  const [soilInput, setSoilInput] = useState<SoilAnalysisInput>(defaultSoilInput);
  const [soilResult, setSoilResult] = useState<SoilData | null>(null);
  const [soilLoading, setSoilLoading] = useState(false);
  const [soilError, setSoilError] = useState<string | null>(null);

  const handleSubmit = async <T,>(
    action: () => Promise<T>,
    setResult: (value: T | null) => void,
    setError: (value: string | null) => void,
    setLoading: (value: boolean) => void,
  ) => {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const data = await action();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative mx-auto max-w-7xl px-6 py-16 text-slate-100">
      <div className="mb-12 rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">Analytics</p>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Detailed prediction studio</h1>
        <p className="mt-4 max-w-3xl text-slate-400">Use separate pages for crop, yield, and soil analysis with live charts and summary cards. This is the advanced workspace for testing real agricultural signals.</p>
      </div>

      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Crop recommendation</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Find the right crop for your field.</h2>
              </div>
              <div className="rounded-3xl bg-slate-800 px-4 py-2 text-xs text-slate-300">Precise</div>
            </div>

            <form
              className="mt-6 grid gap-4 sm:grid-cols-2"
              onSubmit={(event: FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleSubmit(
                  () => fetchCropRecommendation(cropInput),
                  setCropResult,
                  setCropError,
                  setCropLoading,
                );
              }}
            >
              {[
                ["nitrogen", "Nitrogen"],
                ["phosphorus", "Phosphorus"],
                ["potassium", "Potassium"],
                ["temperature", "Temperature"],
                ["humidity", "Humidity"],
                ["ph", "Soil pH"],
                ["rainfall", "Rainfall"],
              ].map(([key, label]) => (
                <label key={key} className="space-y-2 text-sm text-slate-300">
                  <span className="block text-slate-400">{label}</span>
                  <input
                    type="number"
                    value={(cropInput as Record<string, number>)[key]}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setCropInput({
                        ...cropInput,
                        [key]: Number(event.target.value),
                      })
                    }
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                  />
                </label>
              ))}

              <button
                type="submit"
                className="col-span-full rounded-3xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:brightness-110"
              >
                {cropLoading ? "Analyzing…" : "Analyze crop"}
              </button>
            </form>

            <div className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 text-slate-300">
              {cropLoading ? (
                <p>Loading crop recommendation...</p>
              ) : cropError ? (
                <pre className="whitespace-pre-wrap rounded-3xl bg-slate-900 p-4 text-red-400">{cropError}</pre>
              ) : cropResult ? (
                <div className="space-y-4">
                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Recommended crop</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{cropResult.crop}</p>
                    <p className="mt-2 text-sm text-slate-400">{cropResult.description}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-900/80 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Confidence</p>
                      <p className="mt-2 text-3xl font-semibold text-emerald-300">{Math.round(cropResult.confidence * 100)}%</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900/80 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Best season</p>
                      <p className="mt-2 text-lg font-semibold text-white">{cropResult.growingSeason}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500">Submit the crop form to view a recommendation summary.</p>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Yield prediction</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Forecast output before harvest.</h2>
              </div>
              <div className="rounded-3xl bg-slate-800 px-4 py-2 text-xs text-slate-300">Reliable</div>
            </div>

            <form
              className="mt-6 grid gap-4 sm:grid-cols-2"
              onSubmit={(event: FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleSubmit(
                  () => fetchYieldPrediction(yieldInput),
                  setYieldResult,
                  setYieldError,
                  setYieldLoading,
                );
              }}
            >
              <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
                <span className="block text-slate-400">Crop type</span>
                <input
                  type="text"
                  value={yieldInput.cropType}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setYieldInput({ ...yieldInput, cropType: event.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                />
              </label>
              {(
                [
                  ["temperature", "Temperature"],
                  ["humidity", "Humidity"],
                  ["rainfall", "Rainfall"],
                  ["fertilizerUsage", "Fertilizer Usage"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="space-y-2 text-sm text-slate-300">
                  <span className="block text-slate-400">{label}</span>
                  <input
                    type="number"
                    value={yieldInput[key]}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setYieldInput({
                        ...yieldInput,
                        [key]: Number(event.target.value),
                      })
                    }
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                  />
                </label>
              ))}

              <button
                type="submit"
                className="col-span-full rounded-3xl bg-gradient-to-r from-cyan-400 to-sky-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:brightness-110"
              >
                {yieldLoading ? "Predicting…" : "Predict yield"}
              </button>
            </form>

            <div className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 text-slate-300">
              {yieldLoading ? (
                <p>Loading yield prediction...</p>
              ) : yieldError ? (
                <pre className="whitespace-pre-wrap rounded-3xl bg-slate-900 p-4 text-red-400">{yieldError}</pre>
              ) : yieldResult ? (
                <div className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-900/80 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Predicted yield</p>
                      <p className="mt-2 text-3xl font-semibold text-emerald-300">{yieldResult.predictedYield} {yieldResult.unit}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900/80 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Confidence</p>
                      <p className="mt-2 text-3xl font-semibold text-cyan-300">{Math.round(yieldResult.confidence * 100)}%</p>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Monthly trend</p>
                    <div className="mt-4 h-56">
                      <Line
                        data={{
                          labels: yieldResult.historicalData.map((item) => item.month),
                          datasets: [
                            {
                              label: "Actual",
                              data: yieldResult.historicalData.map((item) => item.yield),
                              borderColor: "rgb(56,189,248)",
                              backgroundColor: "rgba(56,189,248,0.15)",
                              tension: 0.3,
                            },
                            {
                              label: "Predicted",
                              data: yieldResult.historicalData.map(() => yieldResult.predictedYield),
                              borderColor: "rgb(16,185,129)",
                              backgroundColor: "rgba(16,185,129,0.15)",
                              borderDash: [4, 4],
                            },
                          ],
                        }}
                        options={{
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: { x: { display: true }, y: { display: true } },
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500">Submit the yield form to render a forecast plus trend chart.</p>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40">
            <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Soil analysis</p>
            <p className="mt-4 text-2xl font-semibold text-white">Know your field in detail.</p>
            <form
              className="mt-6 grid gap-4"
              onSubmit={(event: FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleSubmit(
                  () => fetchSoilAnalysis(soilInput),
                  setSoilResult,
                  setSoilError,
                  setSoilLoading,
                );
              }}
            >
              {[
                ["nitrogen", "Nitrogen"],
                ["phosphorus", "Phosphorus"],
                ["potassium", "Potassium"],
                ["ph", "Soil pH"],
                ["organicMatter", "Organic Matter"],
                ["moisture", "Moisture"],
              ].map(([key, label]) => (
                <label key={key} className="space-y-2 text-sm text-slate-300">
                  <span className="block text-slate-400">{label}</span>
                  <input
                    type="number"
                    value={(soilInput as Record<string, number>)[key]}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setSoilInput({
                        ...soilInput,
                        [key]: Number(event.target.value),
                      })
                    }
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-violet-400"
                  />
                </label>
              ))}

              <button
                type="submit"
                className="rounded-3xl bg-gradient-to-r from-violet-400 to-fuchsia-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:brightness-110"
              >
                {soilLoading ? "Analyzing…" : "Analyze soil"}
              </button>
            </form>

            <div className="mt-8 rounded-[1.75rem] bg-slate-950/80 p-6 text-slate-300">
              {soilLoading ? (
                <p>Loading soil analysis...</p>
              ) : soilError ? (
                <pre className="whitespace-pre-wrap rounded-3xl bg-slate-900 p-4 text-red-400">{soilError}</pre>
              ) : soilResult ? (
                <div className="space-y-4">
                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Health score</p>
                    <p className="mt-2 text-3xl font-semibold text-emerald-300">{Math.round(soilResult.healthScore)}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Cluster</p>
                    <p className="mt-2 text-3xl font-semibold text-cyan-300">{soilResult.cluster}</p>
                  </div>
                  {soilResult.recommendations?.length ? (
                    <div className="rounded-3xl bg-slate-900/80 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Recommendations</p>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300 text-sm">
                        {soilResult.recommendations.map((recommendation, idx) => (
                          <li key={idx}>{recommendation}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="text-slate-500">Submit the soil form to see health metrics and guidance.</p>
              )}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
