import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  CropRecommendationResult,
  YieldPredictionResult,
  SoilData,
  fetchCropRecommendation,
  fetchYieldPrediction,
  fetchSoilAnalysis,
} from "../services/api";

const defaultCropInput = {
  nitrogen: 48,
  phosphorus: 32,
  potassium: 29,
  temperature: 23,
  humidity: 58,
  ph: 6.7,
  rainfall: 135,
};

const defaultYieldInput = {
  cropType: "Corn",
  temperature: 23,
  humidity: 58,
  rainfall: 135,
  fertilizerUsage: 28,
};

const defaultSoilInput = {
  nitrogen: 43,
  phosphorus: 30,
  potassium: 27,
  ph: 6.5,
  organicMatter: 4.2,
  moisture: 34,
};

export default function Demo() {
  const [cropResult, setCropResult] = useState<CropRecommendationResult | null>(null);
  const [yieldResult, setYieldResult] = useState<YieldPredictionResult | null>(null);
  const [soilResult, setSoilResult] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSampleDemo = async () => {
    setError(null);
    setLoading(true);
    setCropResult(null);
    setYieldResult(null);
    setSoilResult(null);

    try {
      const [cropData, yieldData, soilData] = await Promise.all([
        fetchCropRecommendation(defaultCropInput),
        fetchYieldPrediction(defaultYieldInput),
        fetchSoilAnalysis(defaultSoilInput),
      ]);
      setCropResult(cropData);
      setYieldResult(yieldData);
      setSoilResult(soilData);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute left-0 bottom-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

      <section className="relative mx-auto max-w-7xl px-6 py-16 lg:flex lg:items-center lg:justify-between">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-semibold text-emerald-300 backdrop-blur-sm">
            Instant farm demo
          </span>
          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            See RiseAg in action with sample farm data.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-slate-400">
            Run a low-friction demo of crop, yield, and soil predictions without entering values. This page is built for fast exploration and animated insight.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={runSampleDemo}
              className="rounded-full bg-cyan-500 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              {loading ? "Running demo…" : "Run quick demo"}
            </button>
            <div className="rounded-full border border-slate-800 bg-slate-900/80 px-7 py-3 text-sm text-slate-300">
              No credentials · No setup
            </div>
          </div>
          {error ? <p className="max-w-xl text-sm text-red-400">{error}</p> : null}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-0 lg:w-[48%]">
          {[
            { label: "Crop AI", value: "Realtime crop signals" },
            { label: "Yield AI", value: "Harvest projections" },
            { label: "Soil AI", value: "Health diagnostics" },
            { label: "UX", value: "Animated analytics" },
          ].map((item) => (
            <div key={item.label} className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40 transition duration-300 hover:-translate-y-1">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
              <p className="mt-4 text-lg font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6 rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Demo results</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Sample prediction snapshot</h2>
              </div>
              <div className="rounded-full bg-slate-800 px-4 py-2 text-xs text-slate-300">Live preview</div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-950/80 p-4 text-slate-300">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Farm score</p>
                <p className="mt-3 text-3xl font-semibold text-white">82%</p>
                <p className="mt-2 text-sm text-slate-400">Predictive accuracy ready to compare.</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-4 text-slate-300">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Growth window</p>
                <p className="mt-3 text-3xl font-semibold text-cyan-300">Q3</p>
                <p className="mt-2 text-sm text-slate-400">Optimal season for sample fields.</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-4 text-slate-300">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Stability</p>
                <p className="mt-3 text-3xl font-semibold text-emerald-300">High</p>
                <p className="mt-2 text-sm text-slate-400">Balanced crop and soil inputs.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.75rem] bg-slate-950/80 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Crop</p>
                <p className="mt-3 text-xl font-semibold text-white">{cropResult?.crop ?? "Waiting"}</p>
              </div>
              <div className="rounded-[1.75rem] bg-slate-950/80 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Yield</p>
                <p className="mt-3 text-xl font-semibold text-emerald-300">{yieldResult?.predictedYield ? `${yieldResult.predictedYield} ${yieldResult.unit}` : "Waiting"}</p>
              </div>
              <div className="rounded-[1.75rem] bg-slate-950/80 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Soil score</p>
                <p className="mt-3 text-xl font-semibold text-cyan-300">{soilResult ? Math.round(soilResult.healthScore) : "Waiting"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Animated insight</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Farming animation</h3>
              </div>
              <div className="rounded-full bg-slate-800 px-4 py-2 text-xs text-slate-300">Motion UI</div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-6">
              <div className="relative h-72 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900/60 p-4">
                <div className="absolute left-6 top-8 h-20 w-20 rounded-full bg-cyan-400/20 blur-2xl animate-pulse" />
                <div className="absolute right-6 top-16 h-28 w-28 rounded-full bg-emerald-400/10 blur-3xl animate-pulse" />
                <div className="absolute left-8 bottom-12 h-24 w-24 rounded-full bg-emerald-300/20 blur-2xl animate-pulse" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-emerald-300 animate-pulse" />
                    <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">Field status</span>
                  </div>
                  <div className="grid gap-4 text-slate-300 sm:grid-cols-3">
                    {[
                      "Crop index",
                      "Soil balance",
                      "Weather signal",
                    ].map((text) => (
                      <div key={text} className="rounded-3xl bg-slate-900/80 p-4 text-sm">
                        <p className="text-slate-400">{text}</p>
                        <p className="mt-2 text-lg font-semibold text-white">{Math.floor(Math.random() * 30) + 70}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {yieldResult ? (
          <div className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Yield trend</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Sample harvest projection</h3>
            <div className="mt-6 h-72">
              <Line
                data={{
                  labels: yieldResult.historicalData.map((row) => row.month),
                  datasets: [
                    {
                      label: "Actual yield",
                      data: yieldResult.historicalData.map((row) => row.yield),
                      borderColor: "rgb(56,189,248)",
                      backgroundColor: "rgba(56,189,248,0.2)",
                      tension: 0.35,
                    },
                    {
                      label: "Predicted yield",
                      data: yieldResult.historicalData.map(() => yieldResult.predictedYield),
                      borderColor: "rgb(16,185,129)",
                      backgroundColor: "rgba(16,185,129,0.2)",
                      borderDash: [5, 5],
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: "#cbd5e1" } } },
                  scales: {
                    x: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(148,163,184,0.1)" } },
                    y: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(148,163,184,0.1)" } },
                  },
                }}
              />
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
