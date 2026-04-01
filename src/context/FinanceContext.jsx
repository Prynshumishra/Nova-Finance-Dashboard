import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { mockTransactions } from "../data/mockTransactions";
import { ROLES } from "../data/categories";
import { getSummaryTotals } from "../utils/finance";
import { FinanceContext, API_STATUS } from "./FinanceContextObject";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { apiFetchTransactions, apiPing, apiSaveTransaction } from "../services/api";

const TRANSACTION_KEY = "finance-dashboard-transactions-v1";
const ROLE_KEY        = "finance-dashboard-role-v1";
const THEME_KEY       = "finance-dashboard-theme-v1";

const generateId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `tx-${Date.now()}`;


export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions, clearTransactions] = useLocalStorage(
    TRANSACTION_KEY,
    mockTransactions,
  );
  const [role, setRole]     = useLocalStorage(ROLE_KEY, ROLES.VIEWER);
  const [theme, setTheme]   = useLocalStorage(THEME_KEY, "light");

  const [apiStatus,    setApiStatus]    = useState(API_STATUS.LOADING);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [isLoading,    setIsLoading]    = useState(true);

  // Prevent double-fetch in React StrictMode
  const bootedRef = useRef(false);

  /* ── Boot: simulate initial API fetch ─────────────────────────── */
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;

    setApiStatus(API_STATUS.LOADING);

    apiFetchTransactions(transactions)
      .then((data) => {
        setTransactions(data);
        setApiStatus(API_STATUS.SYNCED);
        setLastSyncedAt(new Date());
      })
      .catch(() => setApiStatus(API_STATUS.ERROR))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Theme side-effect ─────────────────────────────────────────── */
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  /* ── Helpers ───────────────────────────────────────────────────── */
  const triggerSync = useCallback(() => {
    setApiStatus(API_STATUS.LOADING);
    apiPing()
      .then(() => {
        setApiStatus(API_STATUS.SYNCED);
        setLastSyncedAt(new Date());
      })
      .catch(() => setApiStatus(API_STATUS.ERROR));
  }, []);

  /* ── CRUD ──────────────────────────────────────────────────────── */
  const addTransaction = useCallback((data) => {
    const tx = { ...data, id: generateId(), amount: Number(data.amount) };
    setTransactions((prev) => [tx, ...prev]);
    apiSaveTransaction(tx)
      .then(() => { setApiStatus(API_STATUS.SYNCED); setLastSyncedAt(new Date()); })
      .catch(() => setApiStatus(API_STATUS.ERROR));
    return tx.id;
  }, [setTransactions]);

  const updateTransaction = useCallback((id, updates) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id !== id
          ? tx
          : { ...tx, ...updates, amount: Number(updates.amount ?? tx.amount) },
      ),
    );
    triggerSync();
  }, [setTransactions, triggerSync]);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    triggerSync();
  }, [setTransactions, triggerSync]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, [setTheme]);

  /** Restore demo data and clear any user additions */
  const resetToDefaults = useCallback(() => {
    clearTransactions();
    setTransactions(mockTransactions);
    triggerSync();
  }, [clearTransactions, setTransactions, triggerSync]);

  /* ── Derived ───────────────────────────────────────────────────── */
  const totals = useMemo(() => getSummaryTotals(transactions), [transactions]);

  const value = useMemo(
    () => ({
      transactions,
      totals,
      role,
      setRole,
      theme,
      toggleTheme,
      isLoading,
      apiStatus,
      lastSyncedAt,
      triggerSync,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      resetToDefaults,
    }),
    [
      transactions, totals, role, setRole, theme, toggleTheme,
      isLoading, apiStatus, lastSyncedAt, triggerSync,
      addTransaction, updateTransaction, deleteTransaction, resetToDefaults,
    ],
  );

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
};
