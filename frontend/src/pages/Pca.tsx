import { useState, type ChangeEvent, type FormEvent } from "react";
import { Line } from "react-chartjs-2";
import { PcaAnalysisInput, PcaAnalysisResult, fetchPcaAnalysis } from "../services/api";

const defaultSamples = "[[45, 6.8, 35], [50, 6.5, 38], [40, 6.2, 32]]";
const defaultFeatures = "nitrogen,ph,moisture";

export default function Pca() {
  const [samples, setSamples] = useState(defaultSamples);
  const [features, setFeatures] = useState(defaultFeatures);
  const [result, setResult] = useState<PcaAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);

    let parsedSamples: number[][];
    try {
      parsedSamples = JSON.parse(samples) as number[][];
    } catch {
      setError("Invalid sample JSON. Use numeric arrays like [[1,2],[3,4]].");
      setLoading(false);
      return;
    }

    const featureList = features
      .split(",")
      .map((feature) => feature.trim())
      .filter(Boolean);

    if (featureList.length === 0) {
      setError("Add at least one feature name.");
      setLoading(false);
      return;
    }

    if (!Array.isArray(parsedSamples) || parsedSamples.length < 2) {
      setError("Provide at least two sample rows for PCA.");
      setLoading(false);
      return;
    }

    try {
      const data = await fetchPcaAnalysis({
        samples: parsedSamples,
        features: featureList,
        n_components: Math.min(2, featureList.length),
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-slate-500/10 blur-3xl" />

      <section className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 shadow-2xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.4em] text-amber-300">PCA analysis</p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Visualize principal components.</h1>
          <p className="mt-4 max-w-3xl text-slate-400">Use PCA to uncover which variables matter most and how your samples cluster across the first two principal components.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <form className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40" onSubmit={handleSubmit}>
            <label className="space-y-2 text-sm text-slate-300">
              <span className="block text-slate-400">Feature names</span>
              <input
                type="text"
                value={features}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setFeatures(event.target.value)}
                className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-amber-400"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span className="block text-slate-400">Sample matrix</span>
              <textarea
                value={samples}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setSamples(event.target.value)}
                rows={6}
                className="w-full rounded-[1.5rem] border border-slate-800 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-amber-400"
              />
            </label>
            <button
              type="submit"
              className="mt-6 w-full rounded-3xl bg-gradient-to-r from-amber-400 to-orange-400 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              {loading ? "Analyzing…" : "Run PCA"}
            </button>
          </form>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">PCA output</p>
            <div className="mt-6 rounded-[1.75rem] bg-slate-950/80 p-6">
              {loading ? (
                <p className="text-slate-400">Running PCA...</p>
              ) : error ? (
                <p className="rounded-3xl bg-red-500/10 p-4 text-sm text-red-300">{error}</p>
              ) : result ? (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {result.explainedVariance.map((value, index) => (
                      <div key={index} className="rounded-3xl bg-slate-900/80 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">PC {index + 1}</p>
                        <p className="mt-3 text-3xl font-semibold text-white">{(value * 100).toFixed(1)}%</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(result.components.slice(0, 2), null, 2)}</pre>
                  </div>
                  <div className="h-64 rounded-[1.75rem] bg-slate-950/90 p-4">
                    <Line
                      data={{
                        labels: result.transformedData.map((_, index) => `Sample ${index + 1}`),
                        datasets: [
                          {
                            label: "Component 1",
                            data: result.transformedData.map((row) => row[0]),
                            borderColor: "rgb(248, 113, 113)",
                            backgroundColor: "rgba(248, 113, 113, 0.2)",
                            tension: 0.35,
                          },
                          {
                            label: "Component 2",
                            data: result.transformedData.map((row) => row[1]),
                            borderColor: "rgb(34,211,238)",
                            backgroundColor: "rgba(34,211,238,0.2)",
                            tension: 0.35,
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
                <p className="text-slate-400">Provide data and run PCA to see component loadings and transformed samples.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
