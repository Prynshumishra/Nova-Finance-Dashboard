export default function EmptyState({ title, message, action }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">{message}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
