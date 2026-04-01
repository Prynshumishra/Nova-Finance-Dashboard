import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../../utils/format";
import { useViewportWidth } from "../../hooks/useViewport";

const COMPACT_NUMBER = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const datum = payload[0].payload;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <p className="font-semibold text-slate-800 dark:text-slate-100">{label}</p>
      <p className="mt-1 text-slate-500 dark:text-slate-300">Balance: {formatCurrency(datum.balance)}</p>
      <p className="text-emerald-600 dark:text-emerald-300">Income: {formatCurrency(datum.income)}</p>
      <p className="text-rose-600 dark:text-rose-300">Expense: {formatCurrency(datum.expenses)}</p>
    </div>
  );
}

export default function BalanceTrendChart({ data }) {
  const viewportWidth = useViewportWidth();
  const isMobile = viewportWidth < 640;

  const chartData = useMemo(
    () => (isMobile ? data.slice(-4) : data),
    [data, isMobile],
  );

  return (
    <div className="glass-card h-[300px] p-4 sm:h-[330px] sm:p-5 md:h-[360px]">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">
          Capital Accumulation Trend
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
          Rolling capital accumulation over the past {chartData.length} months
        </p>
      </div>

      <ResponsiveContainer width="100%" height="82%">
        <AreaChart
          data={chartData}
          margin={{ top: 8, right: isMobile ? 0 : 8, left: isMobile ? -22 : 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f6dff" stopOpacity={0.42} />
              <stop offset="100%" stopColor="#0f6dff" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            fontSize={isMobile ? 10 : 12}
            tickMargin={8}
          />
          {!isMobile ? (
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(value) => COMPACT_NUMBER.format(value)}
            />
          ) : null}
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#0f6dff"
            strokeWidth={isMobile ? 2 : 2.5}
            fill="url(#balanceFill)"
            activeDot={{ r: isMobile ? 4 : 6, fill: "#0f6dff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
