import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { formatAmount, formatDate } from "../../utils/format";
import { useViewportWidth } from "../../hooks/useViewport";

export default function RecentTransactions({ transactions, onViewAll }) {
  const viewportWidth = useViewportWidth();
  const recentLimit = viewportWidth < 640 ? 3 : 5;

  const recentItems = useMemo(
    () =>
      [...transactions]
        .sort((left, right) => new Date(right.date) - new Date(left.date))
        .slice(0, recentLimit),
    [transactions, recentLimit],
  );

  return (
    <section className="glass-card p-4 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">
          Recent Ledger Activity
        </h2>

        <button type="button" className="btn-secondary w-full text-xs sm:w-auto" onClick={onViewAll}>
          View complete ledger
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {recentItems.map((transaction) => (
          <article
            key={transaction.id}
            className="rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2.5 dark:border-slate-700/70 dark:bg-slate-900/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {transaction.description}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {transaction.category} • {formatDate(transaction.date)}
                </p>
              </div>

              <p
                className={`text-sm font-semibold ${
                  transaction.type === "expense"
                    ? "text-rose-600 dark:text-rose-300"
                    : "text-emerald-600 dark:text-emerald-300"
                }`}
              >
                {formatAmount(transaction.amount, transaction.type)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
