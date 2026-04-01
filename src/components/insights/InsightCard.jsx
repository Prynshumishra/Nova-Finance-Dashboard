export default function InsightCard({ title, value, note, icon, tone = "blue" }) {
  const toneClasses = {
    blue: "from-blue-50 to-white dark:from-blue-950/40 dark:to-slate-900",
    emerald: "from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-900",
    amber: "from-amber-50 to-white dark:from-amber-950/40 dark:to-slate-900",
    rose: "from-rose-50 to-white dark:from-rose-950/40 dark:to-slate-900",
  };

  return (
    <article className={`glass-card bg-gradient-to-br p-4 sm:p-5 ${toneClasses[tone] || toneClasses.blue}`}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">{title}</h3>
        <span className="rounded-xl border border-slate-200/70 bg-white/80 p-2 text-slate-600 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-200">
          {icon}
        </span>
      </div>

      <p className="mt-3 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
        {value}
      </p>
      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 sm:mt-2 sm:text-xs">
        {note}
      </p>
    </article>
  );
}
