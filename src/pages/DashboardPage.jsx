import { useMemo } from "react";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { useFinance } from "../context/useFinance";
import HeaderBar from "../components/layout/HeaderBar";
import SummaryCard from "../components/dashboard/SummaryCard";
import BalanceTrendChart from "../components/dashboard/BalanceTrendChart";
import CategoryDonutChart from "../components/dashboard/CategoryDonutChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import { DashboardSkeleton } from "../components/common/LoadingSkeleton";
import {
  getExpenseCategoryBreakdown,
  getMonthlyBalanceSeries,
} from "../utils/finance";
import { formatCurrency } from "../utils/format";

export default function DashboardPage({ onViewTransactions }) {
  const { transactions, totals, isLoading } = useFinance();

  const trendData = useMemo(
    () => getMonthlyBalanceSeries(transactions, 6),
    [transactions],
  );
  const categoryData = useMemo(
    () => getExpenseCategoryBreakdown(transactions),
    [transactions],
  );

  const avgMonthlyExpense = useMemo(() => {
    const totalExpense = trendData.reduce(
      (accumulator, point) => accumulator + point.expenses,
      0,
    );

    return trendData.length ? totalExpense / trendData.length : 0;
  }, [trendData]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <HeaderBar
        title="Intelligence Overview"
        subtitle="Your financial pulse, asset distribution, and recent activity at a glance"
      />

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          title="Net Wealth"
          value={formatCurrency(totals.balance)}
          hint="Aggregated balance across all linked accounts"
          icon={<Wallet size={18} />}
          tone="balance"
          animationDelay={0}
        />

        <SummaryCard
          title="Inbound Cash Flow"
          value={formatCurrency(totals.income)}
          hint="Total aggregated revenue streams"
          icon={<ArrowUpRight size={18} />}
          tone="income"
          animationDelay={80}
        />

        <SummaryCard
          title="Outbound Cash Flow"
          value={formatCurrency(totals.expenses)}
          hint={`Monthly burn rate ${formatCurrency(avgMonthlyExpense)}`}
          icon={<ArrowDownLeft size={18} />}
          tone="expense"
          animationDelay={160}
        />
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 sm:gap-5 lg:grid-cols-3">
        <div className="flex flex-col lg:col-span-2">
          <BalanceTrendChart data={trendData} />
        </div>

        <div className="flex flex-col">
          <CategoryDonutChart data={categoryData} />
        </div>
      </div>

      <RecentTransactions
        transactions={transactions}
        onViewAll={onViewTransactions}
      />
    </div>
  );
}
