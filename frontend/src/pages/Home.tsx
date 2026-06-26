import { Link } from "react-router-dom";

const features = [
  {
    title: "Instant crop guidance",
    description: "One-click estimates for optimal crops based on environment and soil patterns.",
  },
  {
    title: "Yield insight",
    description: "Predict output with confidence and plan harvests more accurately.",
  },
  {
    title: "Soil intelligence",
    description: "Understand soil health metrics and get remediation suggestions instantly.",
  },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute left-0 bottom-0 h-80 w-80 -translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

      <section className="relative mx-auto flex max-w-7xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-6">
          <span className="inline-flex rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-semibold text-emerald-300 backdrop-blur-sm">
            Launch your farm intelligence
          </span>
          <h1 className="text-5xl font-semibold leading-tight text-white sm:text-6xl">
            Transform agriculture with AI-powered crop, yield, and soil predictions.
          </h1>
          <p className="max-w-xl text-lg text-slate-400">
            RiseAg brings a premium multi-page experience with clean visuals, sample-driven demos, and instant farm analytics without manual setup.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/analytics"
              className="rounded-full bg-emerald-400 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Start analytics
            </Link>
            <Link
              to="/demo"
              className="rounded-full border border-slate-700 px-7 py-3 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Try demo
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.18),_transparent_28%)]" />
          <div className="relative flex h-[420px] flex-col justify-between rounded-[1.75rem] border border-slate-800 bg-slate-950/95 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Smart Farm Dashboard</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Live insights</p>
                </div>
                <div className="rounded-2xl bg-slate-800 px-4 py-2 text-xs text-slate-300">Online</div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/90 p-4 text-sm">
                  <p className="text-slate-400">Crop index</p>
                  <p className="mt-3 text-2xl font-semibold text-white">82%</p>
                </div>
                <div className="rounded-3xl bg-slate-900/90 p-4 text-sm">
                  <p className="text-slate-400">Soil health</p>
                  <p className="mt-3 text-2xl font-semibold text-white">78%</p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[1.5rem] bg-gradient-to-br from-slate-900/80 to-slate-850/80 p-5 shadow-inner shadow-slate-950/30">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Yield forecast</span>
                <span>Q3</span>
              </div>
              <div className="mt-4 h-52 rounded-[1.5rem] bg-slate-950/90 p-4">
                <div className="relative h-full w-full rounded-[1.25rem] bg-slate-900/80">
                  <div className="absolute left-6 top-10 h-3 w-24 rounded-full bg-emerald-400/70 animate-pulse" />
                  <div className="absolute left-14 top-24 h-3 w-16 rounded-full bg-cyan-400/60 animate-pulse" />
                  <div className="absolute left-32 top-14 h-3 w-28 rounded-full bg-fuchsia-400/50 animate-pulse" />
                  <div className="absolute right-10 bottom-14 h-3 w-20 rounded-full bg-amber-400/50 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40 transition duration-300 hover:-translate-y-1 hover:border-slate-700">
            <div className="absolute right-6 top-6 h-20 w-20 rounded-full bg-slate-800/60 blur-2xl" />
            <h3 className="relative text-xl font-semibold text-white">{feature.title}</h3>
            <p className="relative mt-4 text-slate-400">{feature.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
