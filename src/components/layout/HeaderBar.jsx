export default function HeaderBar({ title, subtitle, action }) {
  return (
    <header className="flex flex-col gap-2 pb-1 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
      <div className="min-w-0">
        <h1 className="fintech-title text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl lg:text-3xl">
          {title}
        </h1>
        <p className="mt-0.5 max-w-2xl text-xs text-slate-500 dark:text-slate-400 sm:mt-1 sm:text-sm">
          {subtitle}
        </p>
      </div>

      {action ? <div className="w-full sm:w-auto sm:self-start [&>*]:w-full sm:[&>*]:w-auto">{action}</div> : null}
    </header>
  );
}
