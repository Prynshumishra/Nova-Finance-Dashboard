import { useEffect, useRef } from "react";

/**
 * Animates a numeric value from 0 → target over `duration` ms.
 * Works by extracting the first number from the value string.
 */
function useCountUp(value, duration = 900) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Extract leading sign + numeric part (e.g. "$12,300" → 12300, "-$500" → -500)
    const match = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
    if (!match) {
      el.textContent = value;
      return;
    }

    const target   = parseFloat(match[0]);
    const prefix   = value.slice(0, value.indexOf(match[0]));
    const suffix   = value.slice(value.indexOf(match[0]) + match[0].length);
    const start    = performance.now();

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);
      el.textContent = `${prefix}${current.toLocaleString("en-US")}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = value; // ensure final value is exact
      }
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  return ref;
}

export default function SummaryCard({ title, value, hint, icon, tone = "default", animationDelay = 0 }) {
  const countRef = useCountUp(value, 900);

  const toneStyles = {
    default: "from-slate-100 to-white text-slate-700 dark:from-slate-800 dark:to-slate-900",
    balance: "from-blue-50 to-white text-blue-700 dark:from-blue-950/60 dark:to-slate-900 dark:text-blue-300",
    income:  "from-emerald-50 to-white text-emerald-700 dark:from-emerald-950/40 dark:to-slate-900 dark:text-emerald-300",
    expense: "from-rose-50 to-white text-rose-700 dark:from-rose-950/40 dark:to-slate-900 dark:text-rose-300",
  };

  return (
    <article
      className={`glass-card glass-card-hover bg-gradient-to-br p-4 sm:p-5 animate-fade-in-up ${toneStyles[tone] || toneStyles.default}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">{title}</p>
        <span className="rounded-xl border border-slate-200/70 bg-white/80 p-2 text-current dark:border-slate-700/70 dark:bg-slate-900/70 sm:p-2.5">
          {icon}
        </span>
      </div>

      <p
        ref={countRef}
        className="mt-3 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl lg:text-3xl"
      >
        {value}
      </p>
      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 sm:mt-2 sm:text-xs">
        {hint}
      </p>
    </article>
  );
}
