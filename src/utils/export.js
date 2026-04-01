/**
 * Export utilities — CSV and JSON download helpers.
 * Accepts any filtered array of transaction objects.
 */

const CSV_HEADERS = ["Date", "Description", "Category", "Type", "Amount"];

const escapeCSV = (value) => {
  const str = String(value ?? "");
  // Wrap in quotes if value contains comma, quote, or newline
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * Converts transactions array to CSV string and triggers a browser download.
 * @param {object[]} transactions - filtered transaction objects
 * @param {string}   filename     - desired filename (without extension)
 */
export function exportToCSV(transactions, filename = "transactions") {
  const rows = transactions.map((tx) => [
    tx.date,
    tx.description,
    tx.category,
    tx.type,
    tx.amount,
  ]);

  const header = CSV_HEADERS.join(",");
  const body = rows.map((row) => row.map(escapeCSV).join(",")).join("\n");
  const csv = `${header}\n${body}`;

  triggerDownload(csv, `${filename}.csv`, "text/csv;charset=utf-8;");
}

/**
 * Serializes transactions to pretty-printed JSON and triggers a browser download.
 * @param {object[]} transactions - filtered transaction objects
 * @param {string}   filename     - desired filename (without extension)
 */
export function exportToJSON(transactions, filename = "transactions") {
  const json = JSON.stringify(transactions, null, 2);
  triggerDownload(json, `${filename}.json`, "application/json;charset=utf-8;");
}

function triggerDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
