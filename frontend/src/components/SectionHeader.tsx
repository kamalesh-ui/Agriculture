import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export default function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">{eyebrow}</p>
      <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">{title}</h1>
      <p className="mt-4 text-base leading-7 text-slate-400 sm:text-lg">{description}</p>
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}
