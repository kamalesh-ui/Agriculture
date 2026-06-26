import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Crop", path: "/crop" },
  { label: "Yield", path: "/yield" },
  { label: "Soil", path: "/soil" },
  { label: "PCA", path: "/pca" },
  { label: "Demo", path: "/demo" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-900/80 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-3 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-lg font-black text-slate-950">
            AI
          </div>
          <div>
            <p className="text-sm font-semibold">RiseAg</p>
            <p className="text-xs text-slate-500">Smart agriculture</p>
          </div>
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/95 p-3 text-slate-300 transition hover:border-slate-700 hover:text-white md:hidden"
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span className="sr-only">Toggle menu</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `transition hover:text-white ${isActive ? "text-white font-semibold" : "text-slate-400"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/demo"
          className="hidden rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 md:inline-flex"
        >
          Quick Demo
        </Link>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-900/80 bg-slate-950/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-3xl px-4 py-3 text-sm transition ${isActive ? "bg-slate-900 text-white" : "text-slate-300 hover:bg-slate-900/80 hover:text-white"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/demo"
              onClick={() => setMenuOpen(false)}
              className="rounded-3xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Quick Demo
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
