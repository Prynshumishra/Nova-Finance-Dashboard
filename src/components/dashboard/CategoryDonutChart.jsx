import { useMemo } from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { formatCurrency } from "../../utils/format";
import { useViewportWidth } from "../../hooks/useViewport";

const COLORS = ["#4F46E5", "#0ea5e9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

function CategoryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload;

  return (
    <div
      className="rounded-xl px-3 py-2 text-xs shadow-lg"
      style={{
        background: "var(--surface-strong)",
        border: "1px solid var(--border-soft)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
        {entry.name}
      </p>
      <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
        {formatCurrency(entry.value)}
      </p>
    </div>
  );
}

export default function CategoryDonutChart({ data }) {
  const viewportWidth = useViewportWidth();
  const isMobile = viewportWidth < 640;

  const chartData = useMemo(
    () => (isMobile ? data.slice(0, 4) : data.slice(0, 6)),
    [data, isMobile],
  );

  const topCategories = useMemo(
    () => data.slice(0, isMobile ? 3 : 5),
    [data, isMobile],
  );

  // Fixed chart size — guarantees centering (no ResponsiveContainer drift)
  const chartSize = isMobile ? 170 : 195;
  const innerRadius = isMobile ? 40 : 52;
  const outerRadius = isMobile ? 64 : 84;

  return (
    <div
      className="glass-card flex flex-col p-4 sm:p-5"
      style={{ minHeight: "360px" }}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold sm:text-lg" style={{ color: "var(--text-primary)" }}>
            Capital Allocation
          </h2>
          <p className="mt-0.5 text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
            Primary sectors of capital distribution
          </p>
        </div>
        {data.length > 0 && (
          <span
            className="inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold border "
            style={{
              background: "var(--primary-light)",
              color: "var(--primary)",
              border: "1px solid rgba(79,70,229,0.18)",
            }}
          >
            {data.length} categories
          </span>
        )}
      </div>

      {/* Body */}
      {!data.length ? (
        <div
          className="flex flex-1 items-center justify-center rounded-2xl text-sm"
          style={{
            border: "1.5px dashed var(--border-medium)",
            background: "var(--bg-subtle)",
            color: "var(--text-muted)",
            minHeight: "240px",
          }}
        >
          Awaiting outflow data
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          {/* Donut — fixed size + mx-auto so it's always centered */}
          <div
            className="flex shrink-0 items-center justify-center sm:w-[44%]"
          >
            <PieChart width={chartSize} height={chartSize}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx={chartSize / 2}
                cy={chartSize / 2}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={3}
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`${entry.name}-${entry.value}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CategoryTooltip />} />
            </PieChart>
          </div>

          {/* Legend list */}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {topCategories.map((category, index) => {
              const total = data.reduce((sum, d) => sum + d.value, 0);
              const pct = total > 0 ? ((category.value / total) * 100).toFixed(0) : 0;

              return (
                <div
                  key={category.name}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2"
                  style={{
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border-soft)",
                  }}
                >
                  {/* Color swatch */}
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />

                  {/* Name */}
                  <span
                    className="min-w-0 flex-1 truncate text-xs font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {category.name}
                  </span>

                  {/* Percent */}
                  <span
                    className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                    style={{
                      background: `${COLORS[index % COLORS.length]}18`,
                      color: COLORS[index % COLORS.length],
                    }}
                  >
                    {pct}%
                  </span>

                  {/* Amount */}
                  <span
                    className="shrink-0 text-xs font-bold tabular-nums"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {formatCurrency(category.value)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
