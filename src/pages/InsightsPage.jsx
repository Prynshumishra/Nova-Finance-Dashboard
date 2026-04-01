import { useMemo } from "react";
import {
  BadgeDollarSign,
  ChartPie,
  Landmark,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useFinance } from "../context/useFinance";
import HeaderBar from "../components/layout/HeaderBar";
import InsightCard from "../components/insights/InsightCard";
import EmptyState from "../components/common/EmptyState";
import { Activity, CalendarRange, Clock } from "lucide-react";
import { DashboardSkeleton } from "../components/common/LoadingSkeleton";
import {
  getCategoryTrendObservation,
  getHighestSpendingCategory,
  getMonthComparison,
  getMonthlyPrediction,
  getSpendingByDayOfWeek,
} from "../utils/finance";
import { formatCurrency } from "../utils/format";

export default function InsightsPage() {
  const { transactions, totals, isLoading } = useFinance();

  const monthComparison = useMemo(
    () => getMonthComparison(transactions),
    [transactions],
  );
  const highestCategory = useMemo(
    () => getHighestSpendingCategory(transactions),
    [transactions],
  );
  const trendObservation = useMemo(
    () => getCategoryTrendObservation(transactions),
    [transactions],
  );
  const monthlyPrediction = useMemo(
    () => getMonthlyPrediction(transactions),
    [transactions],
  );
  const spendingHabits = useMemo(
    () => getSpendingByDayOfWeek(transactions),
    [transactions],
  );

  const peakDay = useMemo(() => {
    if (!spendingHabits.length) return null;
    return [...spendingHabits].sort((a, b) => b.total - a.total)[0];
  }, [spendingHabits]);

  const savingsRate =
    totals.income === 0 ? 0 : ((totals.income - totals.expenses) / totals.income) * 100;

  const largestExpenses = useMemo(
    () =>
      [...transactions]
        .filter((transaction) => transaction.type === "expense")
        .sort((left, right) => Number(right.amount) - Number(left.amount))
        .slice(0, 3),
    [transactions],
  );

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!transactions.length) {
    return (
      <EmptyState
        title="No intelligence available"
        message="Aggregate transactions to unlock spending patterns and algorithmic observations."
      />
    );
  }

  const changeDirection = monthComparison.changePercent >= 0 ? "up" : "down";

  return (
    <div className="space-y-4 sm:space-y-5">
      <HeaderBar
        title="Financial Intelligence"
        subtitle="Algorithmic observations and spending patterns derived from your activity"
      />

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <InsightCard
          title="Primary Outflow Sector"
          value={
            highestCategory
              ? `${highestCategory.name} (${formatCurrency(highestCategory.total)})`
              : "No expenses this month"
          }
          note="Dominant expense sector in the current cycle"
          icon={<ChartPie size={18} />}
          tone="amber"
        />

        <InsightCard
          title={`${monthComparison.currentLabel} vs ${monthComparison.previousLabel}`}
          value={
            monthComparison.changePercent === 0
              ? "No change"
              : `${Math.abs(monthComparison.changePercent).toFixed(0)}% ${
                  changeDirection === "up" ? "more" : "less"
                }`
          }
          note={`Current: ${formatCurrency(monthComparison.currentTotal)} • Previous: ${formatCurrency(
            monthComparison.previousTotal,
          )}`}
          icon={
            changeDirection === "up" ? <TrendingUp size={18} /> : <TrendingDown size={18} />
          }
          tone={changeDirection === "up" ? "rose" : "emerald"}
        />

        <InsightCard
          title="Savings Rate"
          value={`${Math.max(savingsRate, 0).toFixed(1)}%`}
          note="(Income - Expense) / Income"
          icon={<Landmark size={18} />}
          tone="blue"
        />

        <InsightCard
          title="Liquid Assets"
          value={formatCurrency(totals.balance)}
          note="Total cumulative capital reserves"
          icon={<BadgeDollarSign size={18} />}
          tone="emerald"
        />

        <InsightCard
          title="Predicted Spend"
          value={formatCurrency(monthlyPrediction.predictedTotal)}
          note={`Based on current ${formatCurrency(monthlyPrediction.currentMonthExpenses)} spend`}
          icon={<CalendarRange size={18} />}
          tone={monthlyPrediction.predictedTotal > monthlyPrediction.currentMonthExpenses * 1.2 ? "rose" : "blue"}
        />

        <InsightCard
          title="Peak Spending Day"
          value={peakDay?.day || "N/A"}
          note={peakDay ? `Highest cumulative: ${formatCurrency(peakDay.total)}` : "No activity"}
          icon={<Clock size={18} />}
          tone="indigo"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="glass-card flex flex-col p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <Activity size={18} className="text-indigo-500" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Spending Velocity
            </h2>
          </div>
          
          <div className="flex flex-1 items-end justify-between gap-1 pt-2 sm:gap-2">
            {spendingHabits.map((habit) => (
              <div key={habit.day} className="group relative flex flex-col items-center gap-2">
                <div 
                  className="w-7 rounded-t-lg transition-all duration-300 sm:w-10"
                  style={{ 
                    height: `${Math.max(habit.percent, 5)}%`, 
                    minHeight: "4px",
                    background: habit.percent === 100 
                      ? "linear-gradient(to top, #4F46E5, #818CF8)" 
                      : "var(--primary-light)",
                    opacity: habit.percent === 0 ? 0.2 : 1
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 rounded bg-slate-800 px-2 py-1 text-[10px] text-white transition-transform group-hover:scale-100 dark:bg-slate-700">
                    {formatCurrency(habit.total)}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {habit.day}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Current distributions identify <span className="font-bold text-indigo-600 dark:text-indigo-400">{peakDay?.day}</span> as your highest spending intensity.
          </p>
        </section>

        <section className="glass-card p-4 sm:p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">
            Algorithmic Observation
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {trendObservation}
          </p>
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-3 dark:border-blue-900/30 dark:bg-blue-900/10">
            <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">
              Savings Analysis
            </p>
            <p className="mt-1 text-xs text-blue-700 dark:text-blue-200">
              {savingsRate >= 20 
                ? "Optimal status. You are maintaining a healthy savings buffer above the 20% benchmark."
                : savingsRate > 0 
                  ? "Positive trajectory, but consider optimizing outflows to reach the 20% healthy benchmark."
                  : "Caution: Outflows currently exceed or match inflows. Reserve depletion in progress."}
            </p>
          </div>
        </section>
      </div>

      <section className="glass-card p-4 sm:p-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">
          Significant Outflows
        </h2>

        <div className="mt-3 space-y-2">
          {largestExpenses.length ? (
            largestExpenses.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2 dark:border-slate-700/70 dark:bg-slate-900/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {transaction.description}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {transaction.category}
                  </p>
                </div>
                <p className="text-sm font-semibold text-rose-600 dark:text-rose-300">
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No expense transactions available.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
