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
          className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Quick Demo
        </Link>
      </div>
    </header>
  );
}
