import { useMemo, useRef, useState } from "react";
import { ChevronDown, Download, FileJson, FileText, Plus } from "lucide-react";
import { useFinance } from "../context/useFinance";
import { ROLES } from "../data/categories";
import { filterAndSortTransactions, getUniqueCategories, groupTransactions } from "../utils/finance";
import { exportToCSV, exportToJSON } from "../utils/export";
import HeaderBar from "../components/layout/HeaderBar";
import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionTable from "../components/transactions/TransactionTable";
import TransactionFormModal from "../components/transactions/TransactionFormModal";
import { TransactionsSkeleton } from "../components/common/LoadingSkeleton";

const DEFAULT_FILTERS = {
  search:     "",
  type:       "all",
  category:   "all",
  sortBy:     "date-desc",
  dateFrom:   "",
  dateTo:     "",
  amountMin:  "",
  amountMax:  "",
  groupBy:    "none",
};

export default function TransactionsPage() {
  const {
    transactions,
    role,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useFinance();

  const [filters, setFilters]                     = useState(DEFAULT_FILTERS);
  const [isModalOpen, setIsModalOpen]             = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [exportMenuOpen, setExportMenuOpen]        = useState(false);
  const exportButtonRef                            = useRef(null);

  const isAdmin = role === ROLES.ADMIN;

  /* ── Derived data ── */
  const categories = useMemo(() => getUniqueCategories(transactions), [transactions]);

  const filteredTransactions = useMemo(
    () => filterAndSortTransactions(transactions, filters),
    [transactions, filters],
  );

  const groups = useMemo(
    () => groupTransactions(filteredTransactions, filters.groupBy),
    [filteredTransactions, filters.groupBy],
  );

  const isGrouped = filters.groupBy !== "none";

  /* ── Handlers ── */
  const handleFilterChange = (field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  const openAddModal = () => {
    if (!isAdmin) return;
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tx) => {
    if (!isAdmin) return;
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleSaveTransaction = (data) => {
    if (!isAdmin) return;
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
    } else {
      addTransaction(data);
    }
    closeModal();
  };

  const handleDeleteTransaction = (id) => {
    if (!isAdmin) return;
    if (window.confirm("Delete this transaction? This cannot be undone.")) {
      deleteTransaction(id);
    }
  };

  /* ── Export ── */
  const buildFilename = () => {
    const date = new Date().toISOString().slice(0, 10);
    return `transactions-${date}`;
  };

  const handleExportCSV = () => {
    exportToCSV(filteredTransactions, buildFilename());
    setExportMenuOpen(false);
  };

  const handleExportJSON = () => {
    exportToJSON(filteredTransactions, buildFilename());
    setExportMenuOpen(false);
  };

  /* ── Loading state ── */
  if (isLoading) return <TransactionsSkeleton />;

  /* ── Empty state: no transactions at all ── */
  const totalCount = filteredTransactions.length;
  const hasFiltersActive =
    filters.search || filters.type !== "all" || filters.category !== "all" ||
    filters.dateFrom || filters.dateTo || filters.amountMin !== "" || filters.amountMax !== "";

  /* ── Header actions ── */
  const headerAction = (
    <div className="flex w-full items-center gap-2 sm:w-auto">
      {/* Export dropdown */}
      <div className="relative">
        <button
          ref={exportButtonRef}
          type="button"
          className="btn-secondary gap-1.5"
          onClick={() => setExportMenuOpen((o) => !o)}
          aria-haspopup="true"
          aria-expanded={exportMenuOpen}
          disabled={filteredTransactions.length === 0}
          title={filteredTransactions.length === 0 ? "No data to export" : "Export"}
        >
          <Download size={15} />
          <span className="hidden sm:inline">Export</span>
          <ChevronDown size={13} className={`transition-transform ${exportMenuOpen ? "rotate-180" : ""}`} />
        </button>

        {exportMenuOpen && (
          <>
            {/* click-away overlay */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setExportMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute right-0 z-20 mt-1.5 w-44 overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-lg dark:border-slate-700/70 dark:bg-slate-900 animate-scale-in">
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <FileText size={14} className="text-emerald-500" />
                Export as CSV
              </button>
              <button
                type="button"
                onClick={handleExportJSON}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <FileJson size={14} className="text-indigo-500" />
                Export as JSON
              </button>
            </div>
          </>
        )}
      </div>

      {/* Add transaction */}
      {isAdmin ? (
        <button type="button" className="btn-primary w-full sm:w-auto" onClick={openAddModal}>
          <Plus size={16} />
          Add Transaction
        </button>
      ) : (
        <div className="inline-flex w-full items-center rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2 text-xs font-medium text-slate-500 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-300 sm:w-auto sm:rounded-full sm:py-1.5">
          Viewer mode — editing disabled
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      <HeaderBar
        title="Ledger & Activity"
        subtitle={
          totalCount > 0
            ? `Displaying ${totalCount} ledger entrie${totalCount !== 1 ? "s" : ""}${hasFiltersActive ? " (filtered view)" : ""}`
            : "Search, audit, and categorize your complete financial ledger"
        }
        action={headerAction}
      />

      <TransactionFilters
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      <TransactionTable
        groups={groups}
        isAdmin={isAdmin}
        onEdit={openEditModal}
        onDelete={handleDeleteTransaction}
        isGrouped={isGrouped}
      />

      {isModalOpen && (
        <TransactionFormModal
          key={editingTransaction?.id ?? "new-transaction"}
          onClose={closeModal}
          onSubmit={handleSaveTransaction}
          initialTransaction={editingTransaction}
          categories={categories}
        />
      )}
    </div>
  );
}
