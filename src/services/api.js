/**
 * Mock API service — simulates async network calls with realistic delay.
 * In a real app these would be `fetch()` calls to a backend.
 */

const BASE_DELAY = 420; // ms

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simulates fetching all transactions from the server.
 * Returns the data currently persisted in localStorage (acts as the "DB").
 */
export async function apiFetchTransactions(localData) {
  await delay(BASE_DELAY);
  // In real life this would be: return fetch('/api/transactions').then(r=>r.json())
  return localData;
}

/**
 * Simulates saving a single transaction (POST/PUT).
 */
export async function apiSaveTransaction(transaction) {
  await delay(180);
  return { ...transaction, _synced: true };
}

/**
 * Simulates deleting a transaction (DELETE).
 */
export async function apiDeleteTransaction(transactionId) {
  await delay(150);
  return { id: transactionId, deleted: true };
}

/**
 * Simulates a "sync" ping to the server — used for the sync-status indicator.
 */
export async function apiPing() {
  await delay(200);
  return { ok: true, ts: new Date().toISOString() };
}
