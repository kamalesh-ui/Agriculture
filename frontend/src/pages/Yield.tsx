import { useState, type ChangeEvent, type FormEvent } from "react";
import { Line } from "react-chartjs-2";
import { YieldPredictionInput, YieldPredictionResult, fetchYieldPrediction } from "../services/api";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import SectionHeader from "../components/SectionHeader";

const defaultInput: YieldPredictionInput = {
  cropType: "Wheat",
  temperature: 24,
  humidity: 60,
  rainfall: 130,
  fertilizerUsage: 30,
};

const fields = [
  ["temperature", "Temperature"],
  ["humidity", "Humidity"],
  ["rainfall", "Rainfall"],
  ["fertilizerUsage", "Fertilizer usage"],
] as const;

export default function Yield() {
  const [input, setInput] = useState<YieldPredictionInput>(defaultInput);
  const [result, setResult] = useState<YieldPredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const data = await fetchYieldPrediction(input);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-slate-500/10 blur-3xl" />

      <section className="relative mx-auto max-w-6xl px-6 py-16">
        <SectionHeader
          eyebrow="Yield prediction"
          title="Forecast your harvest output."
          description="Submit crop and climate metrics to estimate yield and visualize trends before planting and fertilizing."
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <Card>
            <form className="grid gap-6" onSubmit={handleSubmit}>
              <label className="space-y-2 text-sm text-slate-300">
                <span className="block text-slate-400">Crop type</span>
                <input
                  type="text"
                  value={input.cropType}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setInput({ ...input, cropType: event.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map(([key, label]) => (
                  <label key={key} className="space-y-2 text-sm text-slate-300">
                    <span className="block text-slate-400">{label}</span>
                    <input
                      type="number"
                      value={input[key]}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setInput({
                          ...input,
                          [key]: Number(event.target.value),
                        })
                      }
                      className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                    />
                  </label>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-400">Predict yield and compare it to your current crop plan.</p>
                <Button type="submit" className="w-full sm:w-auto">
                  {loading ? "Predicting…" : "Predict yield"}
                </Button>
              </div>
            </form>
          </Card>

          <Card>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Prediction results</p>
            <div className="mt-6 rounded-[1.75rem] bg-slate-950/80 p-6">
              {loading ? (
                <p className="text-slate-400">Calculating forecast...</p>
              ) : error ? (
                <p className="rounded-3xl bg-red-500/10 p-4 text-sm text-red-300">{error}</p>
              ) : result ? (
                <div className="space-y-6">
                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Predicted yield</p>
                    <p className="mt-3 text-3xl font-semibold text-emerald-300">{result.predictedYield} {result.unit}</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-900/80 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Confidence</p>
                      <p className="mt-3 text-3xl font-semibold text-cyan-300">{Math.round(result.confidence * 100)}%</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900/80 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Trend</p>
                      <p className="mt-3 text-white">Based on recent monthly output.</p>
                    </div>
                  </div>
                  <div className="h-64 rounded-[1.75rem] bg-slate-950/90 p-4">
                    <Line
                      data={{
                        labels: result.historicalData.map((item) => item.month),
                        datasets: [
                          {
                            label: "Actual yield",
                            data: result.historicalData.map((item) => item.yield),
                            borderColor: "rgb(56,189,248)",
                            backgroundColor: "rgba(56,189,248,0.2)",
                            tension: 0.35,
                          },
                          {
                            label: "Predicted yield",
                            data: result.historicalData.map(() => result.predictedYield),
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
              ) : (
                <p className="text-slate-400">Fill the form and submit to visualize the harvest forecast.</p>
              )}
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
