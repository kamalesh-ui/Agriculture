import { useState, type ChangeEvent, type FormEvent } from "react";
import { SoilAnalysisInput, SoilData, fetchSoilAnalysis } from "../services/api";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import SectionHeader from "../components/SectionHeader";

const defaultInput: SoilAnalysisInput = {
  nitrogen: 45,
  phosphorus: 30,
  potassium: 28,
  ph: 6.6,
  organicMatter: 4.5,
  moisture: 35,
};

const fields = [
  ["nitrogen", "Nitrogen"],
  ["phosphorus", "Phosphorus"],
  ["potassium", "Potassium"],
  ["ph", "Soil pH"],
  ["organicMatter", "Organic matter"],
  ["moisture", "Moisture"],
] as const;

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
        <SectionHeader
          eyebrow="Soil analysis"
          title="Understand soil health instantly."
          description="Submit nutrient, pH, and moisture values to get a detailed soil profile, cluster result, and tailored remediation recommendations."
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <Card>
            <form className="grid gap-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map(([key, label]) => (
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
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-400">Get a soil health score and action plan for your field.</p>
                <Button type="submit" className="w-full sm:w-auto">
                  {loading ? "Analyzing…" : "Analyze soil"}
                </Button>
              </div>
            </form>
          </Card>

          <div className="space-y-6">
            <Card>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Soil output</p>
              <div className="mt-6 rounded-[1.75rem] bg-slate-950/80 p-6">
                {loading ? (
                  <p className="text-slate-400">Running soil diagnostics...</p>
                ) : error ? (
                  <p className="rounded-3xl bg-red-500/10 p-4 text-sm text-red-300">{error}</p>
                ) : result ? (
                  <div className="space-y-6">
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
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Cluster insight</p>
                      <p className="mt-3 text-slate-400">{result.clusterDescription}</p>
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
                  <p className="text-slate-400">Enter soil metrics to reveal your field’s nutrient and moisture profile.</p>
                )}
              </div>
            </Card>

            <Card className="bg-slate-900/90">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Soil best practices</p>
              <ul className="mt-4 space-y-3 text-slate-300 text-sm">
                <li>• Keep pH between 6.0 and 7.0 for most crops.</li>
                <li>• Increase organic matter with compost for better moisture retention.</li>
                <li>• Adjust nitrogen slowly to avoid nutrient burn.</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
