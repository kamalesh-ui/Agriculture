import { useState, type ChangeEvent, type FormEvent } from "react";
import { CropRecommendationInput, CropRecommendationResult, fetchCropRecommendation } from "../services/api";

const defaultInput: CropRecommendationInput = {
  nitrogen: 50,
  phosphorus: 35,
  potassium: 30,
  temperature: 24,
  humidity: 60,
  ph: 6.8,
  rainfall: 140,
};

export default function Crop() {
  const [input, setInput] = useState<CropRecommendationInput>(defaultInput);
  const [result, setResult] = useState<CropRecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const data = await fetchCropRecommendation(input);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute left-0 bottom-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

      <section className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 shadow-2xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.4em] text-emerald-300">Crop recommendation</p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Find the best crop for your field.</h1>
          <p className="mt-4 max-w-3xl text-slate-400">Use this dedicated page to submit soil and weather values, then get a crop recommendation with confidence, season guidance, and water advice.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <form className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["nitrogen", "Nitrogen"],
                  ["phosphorus", "Phosphorus"],
                  ["potassium", "Potassium"],
                  ["temperature", "Temperature"],
                  ["humidity", "Humidity"],
                  ["ph", "Soil pH"],
                  ["rainfall", "Rainfall"],
                ] as const
              ).map(([key, label]) => (
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
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                  />
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-3xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              {loading ? "Analyzing…" : "Get crop recommendation"}
            </button>
          </form>

          <div className="space-y-6 rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40">
            <div className="rounded-[1.75rem] bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Results</p>
              {loading ? (
                <p className="mt-4 text-slate-400">Working on your recommendation...</p>
              ) : error ? (
                <p className="mt-4 rounded-3xl bg-red-500/10 p-4 text-sm text-red-300">{error}</p>
              ) : result ? (
                <div className="space-y-6">
                  <div className="rounded-3xl bg-slate-900/80 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Recommended crop</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{result.crop}</p>
                    <p className="mt-2 text-slate-400">{result.description}</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-900/80 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Confidence</p>
                      <p className="mt-2 text-3xl font-semibold text-emerald-300">{Math.round(result.confidence * 100)}%</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900/80 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Growing season</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{result.growingSeason}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-slate-400">Fill the form and submit to see intelligent crop guidance.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
