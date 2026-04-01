import { Calendar, DollarSign, Layers, Search, SlidersHorizontal, X } from "lucide-react";

const SORT_OPTIONS = [
  { value: "date-desc",   label: "Date (Newest)" },
  { value: "date-asc",    label: "Date (Oldest)" },
  { value: "amount-desc", label: "Amount (High → Low)" },
  { value: "amount-asc",  label: "Amount (Low → High)" },
];

const GROUP_OPTIONS = [
  { value: "none",     label: "No Grouping" },
  { value: "day",      label: "Group by Day" },
  { value: "month",    label: "Group by Month" },
  { value: "category", label: "Group by Category" },
];

export default function TransactionFilters({ filters, categories, onFilterChange, onReset }) {
  const hasActiveFilters =
    filters.search ||
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.amountMin !== "" ||
    filters.amountMax !== "" ||
    filters.groupBy !== "none";

  return (
    <section className="glass-card space-y-3 p-3 sm:p-4 animate-fade-in-up">
      {/* ── Row 1: search + type + category ── */}
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-4">
        <label className="relative lg:col-span-2">
          <span className="sr-only">Search transactions</span>
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            placeholder="Search description or category…"
            className="input-base pl-9"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
          />
        </label>

        <select
          className="input-base"
          value={filters.type}
          onChange={(e) => onFilterChange("type", e.target.value)}
          aria-label="Filter by type"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          className="input-base"
          value={filters.category}
          onChange={(e) => onFilterChange("category", e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* ── Row 2: date range + amount range ── */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        <label className="relative">
          <span className="sr-only">Date from</span>
          <Calendar size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="date"
            className="input-base pl-9 text-sm"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange("dateFrom", e.target.value)}
            aria-label="From date"
            title="From date"
          />
        </label>

        <label className="relative">
          <span className="sr-only">Date to</span>
          <Calendar size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="date"
            className="input-base pl-9 text-sm"
            value={filters.dateTo}
            onChange={(e) => onFilterChange("dateTo", e.target.value)}
            aria-label="To date"
            title="To date"
          />
        </label>

        <label className="relative">
          <span className="sr-only">Min amount</span>
          <DollarSign size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="number"
            placeholder="Min amount"
            className="input-base pl-9 text-sm"
            value={filters.amountMin}
            min={0}
            onChange={(e) => onFilterChange("amountMin", e.target.value)}
            aria-label="Minimum amount"
          />
        </label>

        <label className="relative">
          <span className="sr-only">Max amount</span>
          <DollarSign size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="number"
            placeholder="Max amount"
            className="input-base pl-9 text-sm"
            value={filters.amountMax}
            min={0}
            onChange={(e) => onFilterChange("amountMax", e.target.value)}
            aria-label="Maximum amount"
          />
        </label>
      </div>

      {/* ── Row 3: sort + group + reset ── */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <SlidersHorizontal size={13} />
          <span className="hidden sm:inline">Fine‑tune your view</span>
          {hasActiveFilters && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
              Filters active
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex items-center gap-1">
            <Layers size={13} className="absolute left-2.5 text-slate-400 pointer-events-none" />
            <select
              className="input-base !h-9 w-44 pl-8 text-xs"
              value={filters.groupBy}
              onChange={(e) => onFilterChange("groupBy", e.target.value)}
              aria-label="Group transactions"
            >
              {GROUP_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <select
            className="input-base !h-9 w-48 text-xs"
            value={filters.sortBy}
            onChange={(e) => onFilterChange("sortBy", e.target.value)}
            aria-label="Sort transactions"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <button
            type="button"
            className="btn-secondary !h-9 whitespace-nowrap gap-1.5"
            onClick={onReset}
          >
            <X size={13} />
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}
