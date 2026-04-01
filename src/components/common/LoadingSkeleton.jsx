const generateArray = (length) => Array.from({ length }, (_, index) => index);

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {generateArray(3).map((card) => (
          <div key={card} className="glass-card h-28 p-4 sm:p-5">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton mt-4 h-8 w-32" />
            <div className="skeleton mt-3 h-3 w-20" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
        <div className="glass-card h-72 p-4 sm:h-80 sm:p-5 lg:col-span-2">
          <div className="skeleton h-5 w-40" />
          <div className="skeleton mt-6 h-56 w-full" />
        </div>

        <div className="glass-card h-72 p-4 sm:h-80 sm:p-5">
          <div className="skeleton h-5 w-36" />
          <div className="skeleton mt-6 h-56 w-full" />
        </div>
      </div>
    </div>
  );
}

export function TransactionsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="glass-card h-24 p-4">
        <div className="skeleton h-9 w-full" />
        <div className="skeleton mt-3 h-9 w-full" />
      </div>

      <div className="glass-card overflow-hidden">
        {generateArray(6).map((row) => (
          <div key={row} className="border-b border-slate-200/70 px-4 py-4 last:border-none dark:border-slate-700/70">
            <div className="skeleton h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
