import { useState, type ChangeEvent, type FormEvent } from "react";
import { SoilAnalysisInput, SoilData, fetchSoilAnalysis } from "../services/api";

const defaultInput: SoilAnalysisInput = {
  nitrogen: 45,
  phosphorus: 30,
  potassium: 28,
  ph: 6.6,
  organicMatter: 4.5,
  moisture: 35,
};

export default function Soil() {
  const [input, setInput] = useState<SoilAnalysisInput>(defaultInput);
  const [result, setResult] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const data = await fetchSoilAnalysis(input);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute left-0 bottom-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

      <section className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 shadow-2xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.4em] text-violet-300">Soil analysis</p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Understand soil health instantly.</h1>
          <p className="mt-4 max-w-3xl text-slate-400">Use this page for soil-specific diagnostics, clustering, and recommendation output based on nutrient and moisture inputs.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <form className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40" onSubmit={handleSubmit}>
            {([
              ["nitrogen", "Nitrogen"],
              ["phosphorus", "Phosphorus"],
              ["potassium", "Potassium"],
              ["ph", "Soil pH"],
              ["organicMatter", "Organic matter"],
              ["moisture", "Moisture"],
            ] as const).map(([key, label]) => (
              <label key={key} className="space-y-2 text-sm text-slate-300">
                <span className="block text-slate-400">{label}</span>
                <input
                  type="number"
                  value={(input as Record<string, number>)[key]}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setInput({
                      ...input,
                      [key]: Number(event.target.value),
                    })
                  }
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-violet-400"
                />
              </label>
            ))}
            <button
              type="submit"
              className="mt-6 w-full rounded-3xl bg-gradient-to-r from-violet-400 to-fuchsia-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              {loading ? "Analyzing…" : "Analyze soil"}
            </button>
          </form>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Soil output</p>
            <div className="mt-6 rounded-[1.75rem] bg-slate-950/80 p-6">
              {loading ? (
                <p className="text-slate-400">Running soil diagnostics...</p>
              ) : error ? (
                <p className="rounded-3xl bg-red-500/10 p-4 text-sm text-red-300">{error}</p>
              ) : result ? (
                <div className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-900/80 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Health score</p>
                      <p className="mt-3 text-3xl font-semibold text-emerald-300">{Math.round(result.healthScore)}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900/80 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Cluster</p>
                      <p className="mt-3 text-3xl font-semibold text-cyan-300">{result.cluster}</p>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Recommendations</p>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300 text-sm">
                      {result.recommendations.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400">Enter soil metrics to receive health status and recommendations.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
