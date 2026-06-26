import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 text-center shadow-2xl shadow-slate-950/40">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-500">404</p>
        <h1 className="mt-6 text-5xl font-semibold text-white">Page not found</h1>
        <p className="mt-4 text-slate-400">The page you were looking for doesn’t exist yet. Return to the home page to continue exploring RiseAg.</p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
