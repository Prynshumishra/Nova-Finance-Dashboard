import { useState } from "react";
import { ChevronDown, ChevronRight, PencilLine, Trash2 } from "lucide-react";
import EmptyState from "../common/EmptyState";
import { formatAmount, formatCurrency, formatDate } from "../../utils/format";

function TypePill({ type }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        type === "expense"
          ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
      }`}
    >
      {type}
    </span>
  );
}

function GroupHeader({ group, isCollapsed, onToggle }) {
  const net = group.total;
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
    >
      <div className="flex items-center gap-2">
        {isCollapsed ? (
          <ChevronRight size={15} className="shrink-0 text-slate-400" />
        ) : (
          <ChevronDown size={15} className="shrink-0 text-slate-400" />
        )}
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{group.label}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {group.transactions.length}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs font-medium">
        {group.income > 0 && (
          <span className="text-emerald-600 dark:text-emerald-400">+{formatCurrency(group.income)}</span>
        )}
        {group.expenses > 0 && (
          <span className="text-rose-600 dark:text-rose-400">-{formatCurrency(group.expenses)}</span>
        )}
        <span className={`font-semibold ${net >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
          Net {formatCurrency(Math.abs(net))}
        </span>
      </div>
    </button>
  );
}

function TransactionRows({ transactions, isAdmin, onEdit, onDelete, animate }) {
  return (
    <>
      {/* Desktop table rows */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-left text-xs lg:text-sm">
          <thead className="bg-slate-50/80 text-[11px] uppercase tracking-[0.08em] text-slate-500 dark:bg-slate-900/50 dark:text-slate-400 lg:text-xs">
            <tr>
              <th className="px-3 py-2.5 lg:px-4 lg:py-3">Date</th>
              <th className="px-3 py-2.5 lg:px-4 lg:py-3">Description</th>
              <th className="px-3 py-2.5 lg:px-4 lg:py-3">Category</th>
              <th className="px-3 py-2.5 lg:px-4 lg:py-3">Type</th>
              <th className="px-3 py-2.5 text-right lg:px-4 lg:py-3">Amount</th>
              {isAdmin && <th className="px-3 py-2.5 text-right lg:px-4 lg:py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr
                key={tx.id}
                className={`border-t border-slate-200/80 transition-colors hover:bg-slate-50/70 dark:border-slate-700/70 dark:hover:bg-slate-900/50 ${
                  animate ? "animate-row-enter" : ""
                }`}
                style={animate ? { animationDelay: `${i * 30}ms` } : undefined}
              >
                <td className="whitespace-nowrap px-3 py-2.5 text-slate-600 dark:text-slate-300 lg:px-4 lg:py-3">
                  {formatDate(tx.date)}
                </td>
                <td className="px-3 py-2.5 font-medium text-slate-900 dark:text-slate-100 lg:px-4 lg:py-3">
                  {tx.description}
                </td>
                <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300 lg:px-4 lg:py-3">
                  {tx.category}
                </td>
                <td className="px-3 py-2.5 lg:px-4 lg:py-3">
                  <TypePill type={tx.type} />
                </td>
                <td
                  className={`whitespace-nowrap px-3 py-2.5 text-right font-semibold lg:px-4 lg:py-3 ${
                    tx.type === "expense"
                      ? "text-rose-600 dark:text-rose-300"
                      : "text-emerald-600 dark:text-emerald-300"
                  }`}
                >
                  {formatAmount(tx.amount, tx.type)}
                </td>

                {isAdmin && (
                  <td className="px-3 py-2.5 lg:px-4 lg:py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(tx)}
                        className="btn-secondary"
                        aria-label={`Edit ${tx.description}`}
                      >
                        <PencilLine size={14} />
                        <span className="hidden lg:inline">Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(tx.id)}
                        className="btn-danger"
                        aria-label={`Delete ${tx.description}`}
                      >
                        <Trash2 size={14} />
                        <span className="hidden lg:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-2 md:hidden">
        {transactions.map((tx, i) => (
          <article
            key={tx.id}
            className={`glass-card p-3.5 sm:p-4 ${animate ? "animate-row-enter" : ""}`}
            style={animate ? { animationDelay: `${i * 40}ms` } : undefined}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{tx.description}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(tx.date)} • {tx.category}
                </p>
              </div>
              <TypePill type={tx.type} />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p
                className={`text-lg font-bold ${
                  tx.type === "expense"
                    ? "text-rose-600 dark:text-rose-300"
                    : "text-emerald-600 dark:text-emerald-300"
                }`}
              >
                {formatAmount(tx.amount, tx.type)}
              </p>

              {isAdmin && (
                <div className="flex items-center gap-2">
                  <button type="button" className="btn-secondary" onClick={() => onEdit(tx)}>
                    <PencilLine size={14} />
                  </button>
                  <button type="button" className="btn-danger" onClick={() => onDelete(tx.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function GroupedSection({ group, isAdmin, onEdit, onDelete }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="glass-card overflow-hidden animate-fade-in-up">
      <div className="px-1 py-1">
        <GroupHeader group={group} isCollapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </div>

      {!collapsed && (
        <div className="border-t border-slate-200/60 dark:border-slate-700/60">
          <TransactionRows
            transactions={group.transactions}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
            animate={false}
          />
        </div>
      )}
    </div>
  );
}

export default function TransactionTable({ groups, isAdmin, onEdit, onDelete, isGrouped }) {
  const isEmpty = groups.every((g) => g.transactions.length === 0);

  if (isEmpty) {
    return (
      <EmptyState
        title="No ledger entries found"
        message="Adjust your filter parameters or insert a new entry to populate the ledger."
      />
    );
  }

  // Non-grouped: flat table
  if (!isGrouped) {
    const allTx = groups.flatMap((g) => g.transactions);
    return (
      <section className="glass-card space-y-4 overflow-hidden animate-fade-in-up">
        <TransactionRows
          transactions={allTx}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
          animate
        />
      </section>
    );
  }

  // Grouped sections
  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <GroupedSection
          key={group.key}
          group={group}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
